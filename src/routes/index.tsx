import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Layout from '~/pages/Layout';

export default function Router() {
	const isAuthenticated = true;

	return (
		<MemoryRouter>
			<Routes>
				<Route path='/' element={isAuthenticated ? <Layout /> : null} />
			</Routes>
		</MemoryRouter>
	);
}
