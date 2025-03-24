import { createRoot } from 'react-dom/client';
import FloatKits from './inject/FloatKits/index.tsx';
import ShadowDom from './ShadowDom';
import { useCallback, useEffect, useState } from 'react';
import {
	CrxMessageRequest,
	CrxMessageTypesMap,
	CrxSourceMap,
	FloatKitOptions,
	GlobalOptions,
	SectionKitOptions,
} from './types';
import './utils/htmlNodeUtils.ts';
import SectionKits from './inject/SectionKits/index.tsx';

/**
 * 1. 使用 ShadowDom 避免污染宿主页等问题
 * 2. 由于 css 在 content_script 内引用时会有问题，改为使用 styled-components
 */
export function Injects(): React.ReactElement {
	const [floatKitOptions, setFloatKitOptions] = useState<FloatKitOptions>();
	const [sectionKitOptions, setSectionKitOptions] =
		useState<SectionKitOptions>();

	useEffect(() => {
		chrome.runtime.sendMessage(
			{
				type: CrxMessageTypesMap.GET_GLOBAL_OPTIONS,
				source: CrxSourceMap.CONTENT_SCRIPT,
				payload: {
					keys: ['floatKit', 'sectionKit'],
				},
			} as CrxMessageRequest,
			(response: GlobalOptions) => {
				if (response) {
					setFloatKitOptions(response.floatKit);
					setSectionKitOptions(response.sectionKit);
				}
			}
		);
	}, []);

	const renderFloatKits = useCallback(() => {
		if (floatKitOptions?.visible) {
			return <FloatKits />;
		}
	}, [floatKitOptions]);

	return (
		<ShadowDom>
			{renderFloatKits()}
			<SectionKits kitFeatures={sectionKitOptions?.kitFeatures || []} />
		</ShadowDom>
	);
}

function render(content: React.ReactElement) {
	const container = document.createDocumentFragment();
	const root = createRoot(container);
	root.render(content);
}

render(<Injects />);

console.log('--- content script loaded');
