import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
	BookOutlined,
	SoundOutlined,
	TranslationOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { debounce, map, noop } from 'lodash';
import { singleStreamChat } from '~/network/coze';
import { filterChatMessages, useStreamHandler } from '~/hooks/useStreamHandler';
import KitPanel from './components/KitPanel';
import { CustomKitFeature } from '~/crx/types';

const StyledDiv = styled.div`
	position: absolute;

	.section-kits {
		position: absolute;
		z-index: 999;
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border-radius: 4px;
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
let isSelectionChanged = false;

interface SelectionInfo {
	selectionText: string;
	selectionRect: DOMRect;
	selectionContext: string;
}

export interface KitFeature extends CustomKitFeature {
	icon?: React.ReactNode;
	tip?: string;
	action?: () => void;
	Template?: React.FC<any>;
	CustomPanel?: React.FC<any>;
}

interface SectionKitsProps {
	[key: string]: any;
	customFeatures: CustomKitFeature[];
}
const SectionKits: React.FC<SectionKitsProps> = ({ customFeatures = [] }) => {
	const [selectionInfo, setSelectionInfo] = useState<SelectionInfo>();
	const [showKitPanel, setShowKitPanel] = useState(false);
	const [currentFeature, setCurrentFeature] = useState<KitFeature>();
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
				const rect = range.getBoundingClientRect();

				setCurrentFeature(null);
				setSelectionInfo({
					selectionText: selection.toString(),
					selectionRect: rect,
					selectionContext: selection.anchorNode.textContent,
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

	const handleTranslate = (prompt: string) => {
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

	const handleExplain = (prompt: string) => {
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

	const features: KitFeature[] = [
		{
			label: '翻译',
			prompt: `根据上下文：${selectionContext}，翻译一下：${selectionText}`,
			tip: '翻译',
			icon: <TranslationOutlined className='icon' />,
			action: () => handleTranslate(features[0].prompt),
		},
		{
			label: '解释',
			prompt: `根据上下文：${selectionContext}，解释一下：${selectionText}`,
			tip: '解释',
			icon: <BookOutlined className='icon' />,
			action: () => handleExplain(features[1].prompt),
		},
		{
			label: '朗读',
			prompt: '',
			tip: '朗读',
			icon: <SoundOutlined className='icon' />,
		},
		...map(customFeatures, (item) => ({
			...item,
			prompt: item.prompt.replace('{selection}', selectionText),
		})),
	];

	console.log('--- results', processing, results);

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
						const { tip, icon, action } = feature;
						return (
							<Tooltip
								arrow={false}
								key={index}
								title={tip}
								getTooltipContainer={(triggerNode) => triggerNode.parentElement}
							>
								<div
									className='feature'
									onClick={
										action
											? debounce(() => {
													setShowKitPanel(true);
													setCurrentFeature(feature);
													action();
											  }, 300)
											: noop
									}
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
