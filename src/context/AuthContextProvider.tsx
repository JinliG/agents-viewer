import React, { useEffect, useState } from 'react';
import { AuthContext } from '.';
import auth from '~/network/auth';
import { isChromeExtension } from '~/utils';

export interface IUserInfo {
	id: number | string;
	email: string;
	name: string;
	roles?: string;
	phone?: string | null;
	avatar?: string;
	thirdParty?: { tunnel: string | null };
}

export const useAuthContext = () => React.useContext(AuthContext);

const AuthContextProvider: React.FC<any> = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
	const [userInfo, setUserInfo] = useState<IUserInfo>();

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setIsLoggedIn(true);
		}
	}, []);

	const loginCallback = (user: IUserInfo, token: string) => {
		auth.storeToken(token);
		setUserInfo(user);
		setIsLoggedIn(true);
	};

	const logout = () => {
		auth.logout();
		setIsLoggedIn(false);
	};

	const values = {
		isChromeExtension: isChromeExtension(),
		isLoggedIn,
		userInfo,
		setUserInfo,
		setIsLoggedIn,
		loginCallback,
		logout,
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
