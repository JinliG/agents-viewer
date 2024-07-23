import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthContextProvider from '~/context/AuthContextProvider';
import FeaturesContextProvider from '~/context/FeaturesContextProvider';
import auth from '~/network/auth';

import Layout from '~/pages/Layout';
import Login from '~/pages/Login';

export default function Router() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const accessToken = auth.getToken();
		if (accessToken) {
			auth.verifyToken().then((res) => {
				console.log('--- res', res);
				setIsAuthenticated(true);
			});
		}
	}, []);

	if (isNil(isAuthenticated)) {
		return null;
	}

	return (
		<AuthContextProvider>
			<FeaturesContextProvider>
				<MemoryRouter>
					<Routes>
						{isAuthenticated ? (
							<>
								<Route path='/' element={<Layout />} />
							</>
						) : (
							<Login />
						)}
					</Routes>
				</MemoryRouter>
			</FeaturesContextProvider>
		</AuthContextProvider>
	);
}
