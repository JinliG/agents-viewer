import axios from 'axios';
import queryString from 'query-string';
import React, { useEffect, useRef } from 'react';
import { useAuthContext } from '~/context/AuthContextProvider';
import auth from '~/network/auth';

const googleTokenApi = 'https://oauth2.googleapis.com/token';
const useGoogleAuth = (redirectUrl: string) => {
	const { code } = queryString.parse(location.search);
	const { loginCallback } = useAuthContext();
	const currentRef = useRef(true);

	useEffect(() => {
		const { origin, pathname } = location;
		if (code && origin + pathname === redirectUrl && currentRef.current) {
			currentRef.current = false;
			axios
				.post<any>(googleTokenApi, {
					client_id: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID,
					client_secret: import.meta.env.VITE_GOOGLE_WEB_CLIENT_SECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: redirectUrl,
				})
				.then((res) => {
					if (res.data) {
						auth.googleAuthCallback({ tokens: res.data }).then((res) => {
							if (res.result) {
								const { user, token } = res.result;
								loginCallback(user, token);
							}
						});
					}
				});
		}
	}, [code]);

	const startAuth = () => {
		auth.googleAuth(redirectUrl).then((res) => {
			if (res.authUrl) {
				location.href = res.authUrl;
			}
		});
	};

	return {
		startAuth,
	};
};

export default useGoogleAuth;
