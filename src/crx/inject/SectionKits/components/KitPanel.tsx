import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { SectionFeature } from '..';
import {
	CloseOutlined,
	WechatWorkOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import { map } from 'lodash';
import LoadingDots from '~/components/LoadingDots';
import { Button } from 'antd';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { StreamMessage } from '~/hooks/useStreamHandler';
import { CrxMessageTypesMap, CrxSourceMap } from '~/crx/types';

const StyledDiv = styled.div`
	min-width: 360px;
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
		font-family: monospace;
		line-height: 22px;
		color: #333;
		word-break: break-all;
	}

	.selection-text {
		font-size: 12px;
		color: #666;
	}

	.content {
		margin-bottom: 16px;

		.result-text {
			min-height: 22px;
		}
	}

	.footer {
		.tips {
			font-size: 12px;
		}

		.opts {
			display: flex;
			justify-content: space-between;
		}
	}
`;

interface KitPanelProps {
	[key: string]: any;
	processing: boolean;
	selectionText: string;
	feature: SectionFeature;
	streamMessages: StreamMessage[];
	onClose: () => void;
}

const KitPanel: React.FC<KitPanelProps> = ({
	feature,
	onClose,
	selectionText,
	streamMessages,
	processing,
}) => {
	const { label, customRender } = feature;

	const resultText = useMemo(
		() => map(streamMessages, (item) => item.content).join(''),
		[streamMessages]
	);

	const openSiderPanel = () => {
		chrome.runtime.sendMessage({
			type: CrxMessageTypesMap.OPEN_SIDE_PANEL,
			source: CrxSourceMap.INJECT,
		});
	};

	return (
		<StyledDiv>
			<div className='header'>
				<div className='title'>{label}</div>
				<CloseOutlined onClick={onClose} />
			</div>
			<div className='content'>
				<p className='selection-text'>{selectionText}</p>
				<div className='result-text'>
					{processing ? (
						<LoadingDots />
					) : customRender ? (
						customRender(resultText, streamMessages)
					) : (
						<Markdown remarkPlugins={[remarkGfm]}>{resultText}</Markdown>
					)}
				</div>
			</div>
			<div className='footer'>
				<div className='tips'>
					<p>
						<InfoCircleOutlined />
						&nbsp; 内容生成将依据网页上下文
					</p>
				</div>
				<div className='opts'>
					<Button
						size='small'
						icon={<WechatWorkOutlined />}
						style={{
							fontSize: 12,
						}}
						onClick={openSiderPanel}
					>
						在聊天中继续
					</Button>
				</div>
			</div>
		</StyledDiv>
	);
};
export default KitPanel;
