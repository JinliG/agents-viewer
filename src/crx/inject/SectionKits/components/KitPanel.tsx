import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { KitFeature } from '..';
import { CloseOutlined } from '@ant-design/icons';
import { ChatMessage } from '~/types/coze';
import { map } from 'lodash';

const StyledDiv = styled.div`
	min-width: 300px;
	min-height: 80px;
	background: #fff;
	border-radius: 12px;
	box-shadow: 0 2px 4px #dddddd;
	padding: 10px 12px;

	.header {
		display: flex;
		justify-content: space-between;
	}

	.title,
	.result-text {
		font-size: 14px;
		font-weight: 500;
		color: #333;
	}

	.selection-text {
		font-size: 12px;
		color: #666;
	}
`;

interface KitPanelProps {
	[key: string]: any;
	loading: boolean;
	selectionText: string;
	feature: KitFeature;
	results: ChatMessage[];
	onClose: () => void;
}

const KitPanel: React.FC<KitPanelProps> = ({
	feature,
	onClose,
	selectionText,
	results,
}) => {
	const { label, Template } = feature;

	const resultText = useMemo(
		() => map(results, (item) => item.content).join(''),
		[results]
	);

	return (
		<StyledDiv>
			<div className='header'>
				<div className='title'>{label}</div>
				<CloseOutlined onClick={onClose} />
			</div>
			<div className='content'>
				<p className='selection-text'>{selectionText}</p>
				{Template ? (
					<Template />
				) : (
					<div className='result-text'>{resultText}</div>
				)}
			</div>
			<div className='footer'></div>
		</StyledDiv>
	);
};
export default KitPanel;
