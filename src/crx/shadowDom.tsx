import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';

export default function ShadowDom({
	parentElement = document.body,
	position = 'beforebegin',
	children,
}: {
	parentElement?: Element;
	position?: InsertPosition;
	children: React.ReactNode;
}) {
	const [isInjected, setIsInjected] = useState(false);

	const [shadowHost] = useState(() => {
		const host = document.createElement('shadow-dom-host');
		return host;
	});
	const [shadowRoot] = useState(() => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = chrome.runtime.getURL('inject.css');

		const head = document.createElement('head');
		head.appendChild(link);

		const root = shadowHost.attachShadow({ mode: 'closed' });
		root.appendChild(head);

		return root;
	});

	React.useLayoutEffect(() => {
		if (parentElement) {
			parentElement.insertAdjacentElement(position, shadowHost);
			setIsInjected(true);
		}

		return () => {
			shadowHost.remove();
		};
	}, [parentElement, shadowHost, position]);

	if (!isInjected) {
		return null;
	}

	return ReactDOM.createPortal(
		<StyleSheetManager target={shadowRoot?.querySelector('head')}>
			{children}
		</StyleSheetManager>,
		shadowRoot
	);
}
