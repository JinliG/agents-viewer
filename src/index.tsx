import React from 'react';
import ReactDOM from 'react-dom/client';
import APP from './App';
import { isChromeExtension } from './utils';

console.log('Running in Chrome extension:', isChromeExtension());

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<APP />
	</React.StrictMode>
);
