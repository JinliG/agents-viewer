import { isNil } from 'lodash';
import React from 'react';
import {
	BrowserRouter,
	HashRouter,
	Routes,
	Navigate,
	Route,
} from 'react-router-dom';
import { useAuthContext } from '~/context/AuthContextProvider';

import Layout from '~/pages/Layout';
import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import { isChromeExtension } from '~/utils';

export default function Router() {
	const { isLoggedIn } = useAuthContext();
	const Router = isChromeExtension() ? HashRouter : BrowserRouter;

	if (isNil(isLoggedIn)) {
		return null;
	}

	return (
		<Router>
			<Routes>
				{/* 未认证用户访问 / 时重定向到 /login */}
				<Route
					path='/'
					element={
						isLoggedIn ? (
							<Navigate to='/layout' replace />
						) : (
							<Navigate to='/login' replace />
						)
					}
					index
				/>
				{/* 已认证用户访问 /login 时重定向到 /layout */}
				<Route
					path='/login'
					element={isLoggedIn ? <Navigate to='/layout' replace /> : <Login />}
				/>
				{isLoggedIn && (
					<>
						<Route path='/layout' element={<Layout />} />
					</>
				)}
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Router>
	);
}
