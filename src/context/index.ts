import React from 'react';
import { FeaturesContextProps } from './types';

/**
 * because of vite issue(https://github.com/vitejs/vite/issues/3301)
 * have to separate the context file to another file
 */

const initialState: FeaturesContextProps = {
	loading: false,
	features: [],
	currentFeature: null,
	setCurrentFeature: () => {},
};

export const FeaturesContext =
	React.createContext<FeaturesContextProps>(initialState);

export const AuthContext = React.createContext<any>({});
