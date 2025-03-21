import React from 'react';
import { IAgent } from './AgentsContextProvider';
import { IUserInfo } from './AuthContextProvider';
import { isChromeExtension } from '~/utils';
import { ChatV3Message } from '@coze/api';

/**
 * because of vite issue(https://github.com/vitejs/vite/issues/3301)
 * have to separate the context file to another file
 */
export interface AuthContextProps {
	isLoggedIn: null | boolean;
	isChromeExtension: boolean;
	userInfo: IUserInfo;
	setUserInfo: (user: IUserInfo) => void;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	loginCallback: (user: IUserInfo, token: string) => void;
	logout: () => void;
}
export const authInitState: AuthContextProps = {
	isLoggedIn: null,
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

export interface AgentsContextProps {
	agents: IAgent[];
	current: IAgent | null;
	loading: boolean;
	setCurrent: (iAgent: IAgent) => void;
	setAgents: React.Dispatch<React.SetStateAction<IAgent[]>>;
	updateAgentMessages: (botId: string, messages: ChatV3Message[]) => void;
}
export const agentsInitState: AgentsContextProps = {
	loading: false,
	agents: [],
	current: null,
	setCurrent: () => {},
	setAgents: () => {},
	updateAgentMessages: () => {},
};
export const AgentsContext =
	React.createContext<AgentsContextProps>(agentsInitState);
