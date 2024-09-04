import React, { useRef, useState } from 'react';
import { WechatWorkOutlined, TranslationOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import classNames from 'classnames';
import { CrxMessagesMap, CrxSourceMap } from '~/crx/types';
import { getTextNodesWithXPath } from '~/crx/utils/htmlNodeUtils';

import { YandexTranslator } from '@translate-tools/core/esm/translators/YandexTranslator';
const translator = new YandexTranslator();

const StyledDiv = styled.div`
	position: relative;
	z-index: 999;

	.toolKits {
		position: fixed;
		right: 0;
		bottom: 20%;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;

		.marker {
			width: 36px;
			height: 36px;
			background: #fff;
			border-radius: 50%;
			box-shadow: 0 2px 4px #dddddd;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			.icon {
				font-size: 16px;
			}
		}
		.mainEntry {
			width: 48px;
			height: 48px;

			.icon {
				font-size: 24px;
			}
		}
	}
`;

const ToolKits: React.FC<any> = () => {
	const toolKitsRef = useRef<HTMLDivElement>();
	const [toggleOpened, setToggleOpened] = useState(false);

	// 当前 tab 是否已翻译
	const [translated, setTranslated] = useState(false);

	const onClickEntry = () => {
		chrome.runtime.sendMessage(
			{
				type: toggleOpened
					? CrxMessagesMap.CLOSE_SIDE_PANEL
					: CrxMessagesMap.OPEN_SIDE_PANEL,
				source: CrxSourceMap.INJECT,
			},
			(response) => {
				if (response?.success) {
					setToggleOpened((state) => !state);
				}
			}
		);
	};

	const handleTranslate = () => {
		const results = getTextNodesWithXPath(document.body);
		const originalTexts = results.map(({ text }) => text);

		translator
			.translateBatch(originalTexts, 'en', 'zh')
			.then((translatedTexts) => {
				console.log('Translate result', translatedTexts);

				results.forEach((result, index) => {
					const transTag = document.createElement('avr-trans');
					const transBlock = document.createElement('avr-trans-block');
					transBlock.innerText = translatedTexts[index];
					transBlock.setAttribute(
						'style',
						'display: block;margin:4px 0 8px !important'
					);
					transTag.appendChild(transBlock);

					// 将内容追加到原始元素中
					result.element.appendChild(transTag);
				});
			});
	};

	return (
		<StyledDiv>
			<div
				className='toolKits'
				ref={toolKitsRef}
				draggable
				onDrag={(e) => {
					e.preventDefault();
					if (e.clientY) {
						toolKitsRef.current.style.top = `${e.clientY}px`;
					}
				}}
				onDragEnd={(e) => {
					e.preventDefault();
					toolKitsRef.current.style.top = `${e.clientY}px`;
				}}
			>
				<div
					className={classNames('marker', 'mainEntry')}
					onClick={onClickEntry}
				>
					<WechatWorkOutlined className='icon' />
				</div>
				<div className='marker' onClick={handleTranslate}>
					<TranslationOutlined className='icon' />
				</div>
			</div>
		</StyledDiv>
	);
};
export default ToolKits;
