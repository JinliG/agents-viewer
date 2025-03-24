import React, { useRef, useState } from 'react';
import { GoogleCircleFilled, TranslationOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { CrxMessageTypesMap, CrxSourceMap } from '~/crx/types';
import {
	TextNode,
	getTextNodesWithXPath,
	isBlockLevelElement,
} from '~/crx/utils/htmlNodeUtils';

import { YandexTranslator } from '@translate-tools/core/esm/translators/YandexTranslator';
import { forEach } from 'lodash';
import { Button, Flex } from 'antd';

const translator = new YandexTranslator();

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

const removeTranslateResult = () => {
	const transNodes = document.querySelectorAll('avr-trans');
	forEach(transNodes, (item) => {
		item.remove();
	});
};

const FloatKits: React.FC<any> = () => {
	const floatKitsRef = useRef<HTMLDivElement>();
	const [expanded, setExpanded] = useState(false);
	const [translated, setTranslated] = useState(false);
	const [translating, setTranslating] = useState(false);

	const onClickEntry = () => {
		chrome.runtime.sendMessage({
			type: CrxMessageTypesMap.OPEN_SIDE_PANEL,
			source: CrxSourceMap.INJECT,
		});
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
		if (translated) {
			removeTranslateResult();
			setTranslated(false);
			return;
		}
		const textNodes = getTextNodesWithXPath(document.body);
		const originalTexts = textNodes.map(({ text }) => text);

		setTranslating(true);
		injectTransNodeStyle();
		translator
			.translateBatch(originalTexts, 'en', 'zh')
			.then((translatedTexts) => {
				setTranslated(true);
				renderTranslateResult(translatedTexts, textNodes);
			})
			.finally(() => {
				setTranslating(false);
			});
	};

	return (
		<StyledDiv>
			<FloatKitsDiv
				ref={floatKitsRef}
				draggable
				onDrag={(e) => {
					e.preventDefault();
					if (e.clientY) {
						floatKitsRef.current.style.top = `${e.clientY}px`;
					}
				}}
				onDragEnd={(e) => {
					e.preventDefault();
					floatKitsRef.current.style.top = `${e.clientY}px`;
				}}
				onMouseEnter={(e) => {
					e.preventDefault();
					setExpanded(true);
				}}
				onMouseLeave={(e) => {
					e.preventDefault();
					setExpanded(false);
				}}
			>
				<Button
					shape='circle'
					className='mainEntry'
					onClick={onClickEntry}
					icon={<GoogleCircleFilled className='icon' />}
				/>
				<MarkersWrapper
					className={expanded || translating ? 'visible' : ''}
					vertical
					gap={8}
				>
					<MarkerButton
						type='text'
						shape='circle'
						className={translated ? 'checked' : ''}
						onClick={handleTranslate}
						loading={translating}
						icon={<TranslationOutlined />}
					/>
				</MarkersWrapper>
			</FloatKitsDiv>
		</StyledDiv>
	);
};

export default FloatKits;

const StyledDiv = styled.div`
	position: relative;
	z-index: 999;

	.icon {
		font-size: 24px;
	}
`;

const FloatKitsDiv = styled.div`
	position: fixed;
	right: 8px;
	top: 40%;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;

	.mainEntry {
		width: 48px;
		height: 48px;

		.icon {
			font-size: 24px;
		}
	}
`;

const MarkersWrapper = styled(Flex)`
	position: sticky;
	padding: 4px;
	background: #ffffff;
	border-radius: 16px;
	border: 1px solid #e8e8e8;
	top: 48px;

	display: none;
	opacity: 0;
	transition: opacity, top 0.2s ease-in-out;

	&.visible {
		top: calc(48px + 6px);
		display: flex;
		opacity: 1;
		margin-top: 0;
	}
`;

const MarkerButton = styled(Button)`
	width: 36px;
	height: 36px;
	border-radius: 50%;

	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	&.checked {
		background: var(--color-primary);
		color: #ffffff;
	}

	&:hover {
		background: #f5f5f5;
	}
`;
