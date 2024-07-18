import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import { getBotList } from '~/network/coze/apis';
import ChatPanel from '~/pages/ChatPanel';

interface Feature {
	key: string;
	name: string;
	icon: string;
	botId?: string;
	botAvatar?: string;
	Comp: (props?: any) => React.JSX.Element;
}

interface FeaturesContextProps {
	features: Feature[];
	currentFeature: Feature;
	setCurrentFeature: (feature: Feature) => void;
}

const initialState: FeaturesContextProps = {
	features: [],
	currentFeature: null,
	setCurrentFeature: () => {},
};

const FeaturesContext = React.createContext<FeaturesContextProps>(initialState);
export const useFeaturesContext = () => React.useContext(FeaturesContext);

const FeaturesContextProvider: React.FC<any> = ({ children }) => {
	const [features, setFeatures] = useState<Feature[]>([]);
	const [currentFeature, setCurrentFeature] = useState<Feature>(null);

	useEffect(() => {
		getBotList().then((res) => {
			console.log('--- res', res);
			if (res.code === 0) {
				const { space_bots } = res.data;
				const botFeatures = map(space_bots, (item) => ({
					key: item.bot_id,
					name: item.bot_name,
					icon: item.icon_url,
					botId: item.bot_id,
					botAvatar: item.icon_url,
					Comp: ChatPanel,
				}));
				setFeatures((state) => [...state, ...botFeatures]);
			}
		});
	}, []);

	useEffect(() => {
		setCurrentFeature(features[0]);
	}, [features]);

	const values = {
		features,
		currentFeature,
		setCurrentFeature,
	};

	return (
		<FeaturesContext.Provider value={values}>
			{children}
		</FeaturesContext.Provider>
	);
};

export default FeaturesContextProvider;
