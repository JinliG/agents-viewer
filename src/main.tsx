import React from 'react';
import ReactDOM from 'react-dom/client';
import APP from './index';
import AuthContextProvider from './context/AuthContextProvider';
import { isChromeExtension } from './utils';

console.log('Running in Chrome extension:', isChromeExtension());

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthContextProvider>
			<APP />
		</AuthContextProvider>
	</React.StrictMode>
);
