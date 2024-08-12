import axios from 'axios';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '~/context/AuthContextProvider';
import auth from '~/network/auth';

const googleTokenApi = 'https://oauth2.googleapis.com/token';
const useGoogleAuth = (rUrl: string) => {
	const { code } = queryString.parse(location.search);
	const { loginCallback, isChromeExtension } = useAuthContext();
	const currentRef = useRef(true);

	const [loading, setLoading] = useState(false);

	const redirectUrl = isChromeExtension
		? import.meta.env.VITE_AUTH_CRX_REDIRECT_URL
		: rUrl;

	const handleAuth = (authCode: string) => {
		axios
			.post<any>(googleTokenApi, {
				client_id: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID,
				client_secret: import.meta.env.VITE_GOOGLE_WEB_CLIENT_SECRET,
				code: authCode,
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
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		const { origin, pathname } = location;
		if (code && origin + pathname === redirectUrl && currentRef.current) {
			setLoading(true);
			currentRef.current = false;
			handleAuth(code.toString());
		}
	}, [code]);

	const handleAuthUrl = (url: string) => {
		if (isChromeExtension) {
			setLoading(true);
			chrome.identity.launchWebAuthFlow(
				{
					url,
					interactive: true,
				},
				(redirect) => {
					const {
						query: { code },
					} = queryString.parseUrl(redirect);

					if (code) {
						handleAuth(code.toString());
					}
				}
			);
		} else {
			location.href = url;
		}
	};

	const startAuth = () => {
		setLoading(true);
		auth.googleAuth(redirectUrl).then((res) => {
			if (res.authUrl) {
				handleAuthUrl(res.authUrl);
			}
		});
	};

	return {
		startAuth,
		loading,
	};
};

export default useGoogleAuth;
