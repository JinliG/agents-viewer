import React, { useState } from 'react';
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

const StyledDiv = styled.div`
	position: absolute;

	.section-kits {
		position: absolute;
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
`;

interface SectionKitsProps {
	rect: DOMRect;
	sectionText: string;
}

export interface KitFeature {
	label: string;
	tip?: string;
	icon: React.ReactNode;
	action?: () => void;
}
const SectionKits: React.FC<SectionKitsProps> = ({ rect, sectionText }) => {
	const { top, left } = rect;

	const [currentFeature, setCurrentFeature] = useState<KitFeature>();
	const { handleStream, processing, bufferMessages } = useStreamHandler();

	const handleTranslate = () => {
		if (!processing) {
			const text = `翻译一下：${sectionText}`;
			singleStreamChat(text).then((response) => {
				handleStream(response.body);
			});
		}
	};
	const features = [
		{
			label: '翻译',
			tip: '翻译',
			icon: <TranslationOutlined className='icon' />,
			action: handleTranslate,
		},
		{
			label: '解释',
			tip: '解释',
			icon: <BookOutlined className='icon' />,
		},
		{
			label: '朗读',
			tip: '朗读',
			icon: <SoundOutlined className='icon' />,
		},
	];

	const results = filterChatMessages(bufferMessages, ['answer']);

	return (
		<StyledDiv onMouseUp={(e) => e.stopPropagation()}>
			<div className='section-kits' style={{ top: top + window.scrollY, left }}>
				{map(features, (feature, index) => {
					const { tip, icon, action = noop } = feature;
					return (
						<Tooltip
							key={index}
							title={tip}
							getTooltipContainer={(triggerNode) => triggerNode.parentElement}
						>
							<div
								className='feature'
								onClick={debounce(() => {
									setCurrentFeature(feature);
									action?.();
								}, 300)}
							>
								{icon}
							</div>
						</Tooltip>
					);
				})}
			</div>
		</StyledDiv>
	);
};
export default SectionKits;
