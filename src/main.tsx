import React from 'react';
import ReactDOM from 'react-dom/client';
import APP from './index';
import AuthContextProvider from './context/AuthContextProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthContextProvider>
			<APP />
		</AuthContextProvider>
	</React.StrictMode>
);
