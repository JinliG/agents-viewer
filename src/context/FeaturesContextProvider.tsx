import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import { getBotList } from '~/network/coze/apis';
import ChatPanel from '~/pages/ChatPanel';
import { FeaturesContext } from '.';
import { Feature } from './types';

const defaults: Feature[] = [];

export const useFeaturesContext = () => React.useContext(FeaturesContext);

const FeaturesContextProvider: React.FC<any> = ({ children }) => {
	const [features, setFeatures] = useState<Feature[]>([]);
	const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getBotList()
			.then((res) => {
				setLoading(false);
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
					setFeatures(() => [...botFeatures, ...defaults]);
					setCurrentFeature(botFeatures[0]);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const values = {
		loading,
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
