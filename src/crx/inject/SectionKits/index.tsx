import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	BookOutlined,
	SoundOutlined,
	TranslationOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { debounce, map } from 'lodash';
import { singleStreamChat } from '~/network/coze';
import { filterChatMessages, useStreamHandler } from '~/hooks/useStreamHandler';
import KitPanel from './components/KitPanel';
import { DefaultSectionKitMap, KitFeature } from '~/crx/types';

interface ExtraFeatureProps {
	prompt: string;
	icon: React.ReactNode;
	action: (...arg) => void;
	CustomPanel?: React.FC<any>;
}
export interface SectionFeature extends KitFeature, ExtraFeatureProps {}

let isSelectionChanged = false;
const StyledDiv = styled.div`
	position: absolute;

	.section-kits {
		position: absolute;
		z-index: 999;
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border-radius: 16px;
		border: 0.5px solid #ccc;
		box-shadow: 0 2px 4px #dddddd;
		padding: 4px 10px;

		.feature {
			cursor: pointer;
			padding: 2px 4px;
			.icon {
				font-size: 16px;
			}

			&:hover {
				background: #eee;
				border-radius: 4px;
			}
		}
	}

	.kit-panel-wrapper {
		position: absolute;
		z-index: 999;
	}
`;

interface SelectionInfo {
	selectionText: string;
	selectionRect: DOMRect;
	selectionContext: string;
}

interface SectionKitsProps {
	[key: string]: any;
	kitFeatures: KitFeature[];
}
const SectionKits: React.FC<SectionKitsProps> = ({ kitFeatures = [] }) => {
	const [selectionInfo, setSelectionInfo] = useState<SelectionInfo>();
	const [showKitPanel, setShowKitPanel] = useState(false);
	const [currentFeature, setCurrentFeature] = useState<SectionFeature>();
	const [loading, setLoading] = useState(false);

	const { handleStream, processing, chatMessages } = useStreamHandler();

	const handleRemoveSectionKit = () => {
		setSelectionInfo(null);
		setShowKitPanel(false);
	};

	const handleSelectionChange = () => {
		isSelectionChanged = true;
	};

	const handleMouseUp = () => {
		const selection = window.getSelection();

		if (isSelectionChanged && selection.toString().length > 0) {
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				// 折叠选区改为获取 focusNode
				const rect = selection.isCollapsed
					? (selection.focusNode as any).getBoundingClientRect()
					: range.getBoundingClientRect();

				setCurrentFeature(null);
				setSelectionInfo({
					selectionText: selection.toString(),
					selectionRect: rect,
					selectionContext: selection.focusNode.parentElement.textContent,
				});
				console.log('选中文本的边界框信息：', selection.toString(), rect);
			}
			isSelectionChanged = false;
		} else {
			handleRemoveSectionKit();
		}
	};

	useEffect(() => {
		// 添加文本选择事件监听器
		document.addEventListener('selectionchange', handleSelectionChange);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('selectionchange', handleSelectionChange);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, []);

	if (!selectionInfo) {
		return null;
	}

	const { selectionRect, selectionText, selectionContext } = selectionInfo;
	const { top, left, height } = selectionRect;
	const results = filterChatMessages(chatMessages, ['answer']);

	const defaultAction = (prompt: string) => {
		if (!processing) {
			setLoading(true);
			singleStreamChat(prompt)
				.then((response) => {
					setLoading(false);
					handleStream(response.body);
				})
				.catch(() => {
					setLoading(false);
				});
		}
	};

	const optionalKitPropsMap: Partial<
		Record<DefaultSectionKitMap, ExtraFeatureProps>
	> = {
		[DefaultSectionKitMap.TRANSLATE]: {
			icon: <TranslationOutlined className='icon' />,
			action: defaultAction,
			prompt: `根据上下文："${selectionContext}"，翻译一下：${selectionText}。`,
		},
		[DefaultSectionKitMap.EXPLAIN]: {
			icon: <BookOutlined className='icon' />,
			action: defaultAction,
			prompt: `根据上下文："${selectionContext}"，解释：${selectionText}。如无上下文，则直接解释。`,
		},
		[DefaultSectionKitMap.CONTINUE]: {
			icon: <TranslationOutlined className='icon' />,
			action: defaultAction,
			prompt: `根据上下文："${selectionContext}"，续写以下内容：${selectionText}。`,
		},
		[DefaultSectionKitMap.OPTIMIZE]: {
			icon: <BookOutlined className='icon' />,
			action: defaultAction,
			prompt: `根据上下文："${selectionContext}"，优化以下内容：${selectionText}。`,
		},
		[DefaultSectionKitMap.READ]: {
			icon: <SoundOutlined className='icon' />,
			action: defaultAction,
			prompt: `朗读以下内容："${selectionText}"。直接返回语音链接不要其他文本。`,
		},
	};

	const features: SectionFeature[] = map(kitFeatures, (item) => {
		const { key, prompt, isDefault } = item;

		if (isDefault) {
			const rest = optionalKitPropsMap[key];
			return {
				...item,
				action: () => defaultAction(prompt),
				...rest,
			};
		} else {
			const realPrompt = prompt.replace(
				/\{\{selection\}\}/g,
				`"${selectionText}"`
			);
			return {
				...item,
				prompt: realPrompt,
				action: () => defaultAction(realPrompt),
			};
		}
	});

	const handleCloseKitPanel = () => {
		setShowKitPanel(false);
	};

	const { CustomPanel } = currentFeature || {};

	return (
		<StyledDiv onMouseUp={(e) => e.stopPropagation()}>
			{!currentFeature && (
				<div
					className='section-kits'
					style={{ top: top + window.scrollY + height + 10, left }}
				>
					{map(features, (feature, index) => {
						const { label, icon, action, prompt } = feature;
						return (
							<Tooltip
								arrow={false}
								key={index}
								title={label}
								getTooltipContainer={(triggerNode) => triggerNode.parentElement}
							>
								<div
									className='feature'
									onClick={debounce(() => {
										setShowKitPanel(true);
										setCurrentFeature(feature);
										action(prompt);
									}, 300)}
								>
									{icon}
								</div>
							</Tooltip>
						);
					})}
				</div>
			)}
			{showKitPanel && currentFeature && (
				<div
					className='kit-panel-wrapper'
					style={{ top: top + window.scrollY + height + 20, left }}
				>
					{CustomPanel ? (
						<CustomPanel
							loading={loading}
							results={results}
							selectionText={selectionText}
							feature={currentFeature}
							onClose={handleCloseKitPanel}
						/>
					) : (
						<KitPanel
							loading={loading}
							results={results}
							selectionText={selectionText}
							feature={currentFeature}
							onClose={handleCloseKitPanel}
						/>
					)}
				</div>
			)}
		</StyledDiv>
	);
};
export default SectionKits;
