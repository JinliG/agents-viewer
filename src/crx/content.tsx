import { createRoot } from 'react-dom/client';
import ToolKits from './inject/ToolKits';
import ShadowDom from './ShadowDom';
import { useEffect, useState } from 'react';
import { CrxMessagesMap, CrxSetting, CrxSourceMap } from './types';
import './utils/htmlNodeUtils.ts';

console.log('--- content script loaded');

/**
 * 1. 使用 ShadowDom 避免污染宿主页等问题
 * 2. 由于 css 在 content_script 内引用时会有问题，改为使用 styled-components
 */
export function Injects(): React.ReactElement {
	const [crxSetting, setCrxSetting] = useState<CrxSetting>();

	useEffect(() => {
		chrome.runtime.sendMessage(
			{
				type: CrxMessagesMap.GET_CRX_SETTING,
				source: CrxSourceMap.CONTENT_SCRIPT,
			},
			(response) => {
				console.log('--- content script receive message', response);
				if (response) {
					setCrxSetting(response);
				}
			}
		);
	}, []);

	return <ShadowDom>{crxSetting?.bubble && <ToolKits />}</ShadowDom>;
}

function render(content: React.ReactElement) {
	const container = document.createDocumentFragment();
	const root = createRoot(container);
	root.render(content);
}

render(<Injects />);
