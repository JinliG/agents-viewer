import React, { useEffect, useState } from 'react';
import { AuthContext } from '.';
import auth from '~/network/auth';

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
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userInfo, setUserInfo] = useState<IUserInfo>({
		id: '',
		name: '',
		email: '',
		avatar: 'https://s4.ax1x.com/2021/12/22/TQT3rj.png',
	});

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setIsLoggedIn(true);
		}
	}, []);

	const loginCallback = (user: IUserInfo, token: string) => {
		console.log('--- user', user, token);
		auth.storeToken(token);
		setUserInfo(user);
		setIsLoggedIn(true);
	};

	const logout = () => {
		auth.logout();
		setIsLoggedIn(false);
	};

	const values = {
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
