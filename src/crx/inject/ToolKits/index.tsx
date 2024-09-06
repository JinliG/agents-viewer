import React, { useRef, useState } from 'react';
import { WechatWorkOutlined, TranslationOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import classNames from 'classnames';
import { CrxMessagesMap, CrxSourceMap } from '~/crx/types';
import {
	TextNode,
	getTextNodesWithXPath,
	isBlockLevelElement,
} from '~/crx/utils/htmlNodeUtils';

import { YandexTranslator } from '@translate-tools/core/esm/translators/YandexTranslator';
import { forEach } from 'lodash';
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

const renderTranslateResult = (result: string[], textNodes: TextNode[]) => {
	let transWrapper = null;
	let transDom = null;
	let siblingParent: HTMLElement = null;

	const init = (item: TextNode) => {
		siblingParent = item.siblingParentBlock;
		transWrapper = document.createElement('avr-trans');
		transDom = isBlockLevelElement(item.siblingParentBlock)
			? document.createElement('avr-trans-block')
			: document.createElement('avr-trans-inline');
	};

	const cloneElement = (item: TextNode) => {
		if (item.element === item.siblingParentBlock) {
			return item.node.cloneNode(true);
		}

		return item.element.cloneNode(true);
	};

	forEach(textNodes, (item, index) => {
		// 初始化
		if (!transWrapper && !transDom) {
			init(item);

			const transNode = cloneElement(item);
			transNode.textContent = result[index];
			transDom.appendChild(transNode);
			return;
		}

		// 新的父元素
		if (siblingParent && siblingParent !== item.siblingParentBlock) {
			transWrapper.appendChild(transDom);
			siblingParent.appendChild(transWrapper);

			init(item);
		}

		const transNode = cloneElement(item);
		transNode.textContent = result[index];
		transDom.appendChild(transNode);
	});
};

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

	const injectTransNodeStyle = () => {
		if (!document.querySelector('#avr-trans-style')) {
			const style = document.createElement('style');
			style.id = 'avr-trans-style';
			style.innerHTML = `
			avr-trans >  avr-trans-block {
				display: block;
				margin: 4px 0 8px !important;
			}

			avr-trans >  avr-trans-inline {
				margin-inline-start: 4px !important;
			}
		`;
			document.head.appendChild(style);
		}
	};

	const handleTranslate = () => {
		const textNodes = getTextNodesWithXPath(document.body);
		const originalTexts = textNodes.map(({ text }) => text);
		console.log('--- textNodes', textNodes);

		injectTransNodeStyle();
		translator
			.translateBatch(originalTexts, 'en', 'zh')
			.then((translatedTexts) => {
				console.log('Translate result', translatedTexts);
				renderTranslateResult(translatedTexts, textNodes);
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
