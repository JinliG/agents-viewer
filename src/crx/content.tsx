import { createRoot } from 'react-dom/client';
import ShadowDom from './shadowDom';
import ToolKits from './inject/ToolKits';

console.log('--- content script loaded');

export function render(content: React.ReactElement) {
	const container = document.createDocumentFragment();
	const root = createRoot(container);
	console.log('--- root', root);
	root.render(content);
}

/**
 * 1. 使用 ShadowDom 避免污染宿主页等问题
 * 2. 由于 css 在 content_script 内引用时会有问题，改为使用 styled-components
 */

export function Injects(): React.ReactElement {
	return (
		<ShadowDom>
			<ToolKits />
		</ShadowDom>
	);
}

render(<Injects />);
