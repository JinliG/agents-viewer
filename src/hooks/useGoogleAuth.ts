import axios from 'axios';
import queryString from 'query-string';
import React, { useEffect } from 'react';

const googleAuthApi = 'https://accounts.google.com/o/oauth2/v2/auth';
const googleTokenApi = 'https://oauth2.googleapis.com/token';

const useGoogleAuth = (redirectUrl: string) => {
	const { code, ...rest } = queryString.parse(location.search);

	useEffect(() => {
		console.log('--- inside code', code, rest);
		const { origin, pathname } = location;
		if (code && origin + pathname === redirectUrl) {
			console.log('--- handle redirect');
			axios
				.post(googleTokenApi, {
					client_id: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID,
					client_secret: import.meta.env.VITE_GOOGLE_WEB_CLIENT_SECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: redirectUrl,
				})
				.then((res) => {
					console.log('--- google', res);
					// TODO: 区分注册登录和登录
				});
		}
	}, [code]);
	const startAuth = () => {
		const params = {
			client_id: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID,
			redirect_uri: redirectUrl,
			response_type: 'code',
			scope: 'https://www.googleapis.com/auth/userinfo.email',
		};

		console.log('--- jump', `${googleAuthApi}?${new URLSearchParams(params)}`);
		window.open(`${googleAuthApi}?${new URLSearchParams(params)}`);
	};

	return {
		startAuth,
	};
};

export default useGoogleAuth;
