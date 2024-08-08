import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom';
import { useAuthContext } from '~/context/AuthContextProvider';
import FeaturesContextProvider from '~/context/FeaturesContextProvider';
import auth from '~/network/auth';

import Layout from '~/pages/Layout';
import Login from '~/pages/Login';

export default function Router() {
	const { isLoggedIn, setUserInfo, setIsLoggedIn } = useAuthContext();

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
					}
				})
				.catch(() => {});
		} else {
		}
	}, []);

	return (
		<FeaturesContextProvider>
			<BrowserRouter>
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
					{isLoggedIn && (
						<>
							<Route path='/layout' element={<Layout />} />
						</>
					)}
					{/* 已认证用户访问 /login 时重定向到 /layout */}
					<Route
						path='/login'
						element={isLoggedIn ? <Navigate to='/layout' replace /> : <Login />}
					/>
				</Routes>
			</BrowserRouter>
		</FeaturesContextProvider>
	);
}
