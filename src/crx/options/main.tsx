import React from 'react';
import ReactDOM from 'react-dom/client';
import Options from './index';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

ReactDOM.createRoot(document.getElementById('options')!).render(
	<React.StrictMode>
		<DndProvider backend={HTML5Backend}>
			<Options />
		</DndProvider>
	</React.StrictMode>
);
