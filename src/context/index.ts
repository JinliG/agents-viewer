import React from 'react';
import { IFeature } from './FeaturesContextProvider';
import { IUserInfo } from './AuthContextProvider';
import { isChromeExtension } from '~/utils';

/**
 * because of vite issue(https://github.com/vitejs/vite/issues/3301)
 * have to separate the context file to another file
 */
export interface AuthContextProps {
	isLoggedIn: boolean;
	isChromeExtension: boolean;
	userInfo: IUserInfo;
	setUserInfo: (user: IUserInfo) => void;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	loginCallback: (user: IUserInfo, token: string) => void;
	logout: () => void;
}
export const authInitState: AuthContextProps = {
	isLoggedIn: false,
	isChromeExtension: isChromeExtension(),
	userInfo: {
		id: '',
		name: '',
		email: '',
	},
	setUserInfo: () => {},
	setIsLoggedIn: () => {},
	loginCallback: () => {},
	logout: () => {},
};

export const AuthContext = React.createContext<AuthContextProps>(authInitState);

export interface FeaturesContextProps {
	features: IFeature[];
	currentFeature: IFeature | null;
	loading: boolean;
	setCurrentFeature: (feature: IFeature) => void;
}
export const featuresInitState: FeaturesContextProps = {
	loading: false,
	features: [],
	currentFeature: null,
	setCurrentFeature: () => {},
};
export const FeaturesContext =
	React.createContext<FeaturesContextProps>(featuresInitState);
