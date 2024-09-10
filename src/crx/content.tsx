import { createRoot } from 'react-dom/client';
import ToolKits from './inject/ToolKits/index.tsx';
import ShadowDom from './ShadowDom';
import { useCallback, useEffect, useState } from 'react';
import { CrxMessagesMap, CrxSetting, CrxSourceMap } from './types';
import './utils/htmlNodeUtils.ts';
import SectionKits from './inject/SectionKits/index.tsx';
console.log('--- content script loaded');

/**
 * 1. 使用 ShadowDom 避免污染宿主页等问题
 * 2. 由于 css 在 content_script 内引用时会有问题，改为使用 styled-components
 */
export function Injects(): React.ReactElement {
	const [crxSetting, setCrxSetting] = useState<CrxSetting>();

	useEffect(() => {
		console.log('--- rerended', document.location.href);
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

	const renderToolKits = useCallback(() => {
		if (crxSetting?.bubble) {
			return <ToolKits />;
		}
	}, [crxSetting?.bubble]);

	return (
		<ShadowDom>
			{renderToolKits()}
			<SectionKits />
		</ShadowDom>
	);
}

function render(content: React.ReactElement) {
	const container = document.createDocumentFragment();
	const root = createRoot(container);
	root.render(content);
}

render(<Injects />);
