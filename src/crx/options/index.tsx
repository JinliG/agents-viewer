import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AntdProvider from '~/context/AntdProvider';
import AuthContextProvider from '~/context/AuthContextProvider';
import AgentsContextProvider from '~/context/AgentsContextProvider';

ReactDOM.createRoot(document.getElementById('options')!).render(
	<React.StrictMode>
		<AuthContextProvider>
			<AgentsContextProvider>
				<AntdProvider>
					<DndProvider backend={HTML5Backend}>
						<App />
						<ToastContainer />
					</DndProvider>
				</AntdProvider>
			</AgentsContextProvider>
		</AuthContextProvider>
	</React.StrictMode>
);
