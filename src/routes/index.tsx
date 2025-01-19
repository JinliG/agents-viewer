import { isNil } from 'lodash';
import React, { useEffect } from 'react';
import {
	BrowserRouter,
	HashRouter,
	Routes,
	Navigate,
	Route,
	redirect,
} from 'react-router-dom';
import { useAuthContext } from '~/context/AuthContextProvider';
import FeaturesContextProvider from '~/context/FeaturesContextProvider';
import auth from '~/network/auth';

import Layout from '~/pages/Layout';
import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import { isChromeExtension } from '~/utils';

export default function Router() {
	const { setUserInfo, setIsLoggedIn } = useAuthContext();
	const isLoggedIn = true;

	const Router = isChromeExtension() ? HashRouter : BrowserRouter;

	useEffect(() => {
		// 如果存在token，则验证用户认证
		const accessToken = auth.getToken();
		if (accessToken) {
			auth
				.getCurrentUser()
				.then((res) => {
					if (res.user) {
						setUserInfo(res.user);
						setIsLoggedIn(true);
					} else {
						auth.removeToken();
						setIsLoggedIn(false);
						redirect('/login');
					}
				})
				.catch((err) => {
					console.error('--- ', err);
				});
		} else {
			setIsLoggedIn(false);
		}
	}, []);

	if (isNil(isLoggedIn)) {
		return null;
	}

	return (
		<FeaturesContextProvider>
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
		</FeaturesContextProvider>
	);
}
