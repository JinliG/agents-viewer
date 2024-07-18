import React, { useEffect, useState } from 'react';
import { AuthContext } from '.';
import { UserInfoProps } from './types';

export const useAuthContext = () => React.useContext(AuthContext);

const AuthContextProvider: React.FC<any> = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userInfo, setUserInfo] = useState<UserInfoProps>({
		id: '',
		name: '',
		email: '',
		avatar: 'https://s4.ax1x.com/2021/12/22/TQT3rj.png',
		token: '',
	});

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setIsLoggedIn(true);
		}
	}, []);

	const values = {
		isLoggedIn,
		userInfo,
	};

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
