import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import { getBotList } from '~/network/coze';
import ChatPanel from '~/pages/ChatPanel';
import { AgentsContext } from '.';
import { ChatV3Message } from '@coze/api';

export interface IAgent {
	key: string;
	name: string;
	icon: string;
	botId?: string;
	botAvatar?: string;
	active?: boolean;
	messages?: ChatV3Message[];
	Comp: (props?: any) => React.JSX.Element;
}

export const useAgentsContext = () => React.useContext(AgentsContext);

const defaults: IAgent[] = [];
const AgentsContextProvider: React.FC<any> = ({ children }) => {
	const [agents, setAgents] = useState<IAgent[]>([]);
	const [current, setCurrent] = useState<IAgent | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getBotList()
			.then((res) => {
				setLoading(false);
				if (res.code === 0) {
					const { space_bots } = res.data;
					const botFeatures = map(space_bots, (item, index) => ({
						key: item.bot_id,
						name: item.bot_name,
						icon: item.icon_url,
						botId: item.bot_id,
						botAvatar: item.icon_url,
						active: index <= 5,
						Comp: ChatPanel,
					}));
					setAgents(() => [...botFeatures, ...defaults]);
					setCurrent(botFeatures[0]);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const updateAgentMessages = (botId: string, messages: ChatV3Message[]) => {
		setAgents((prev) => {
			const newAgents = [...prev];
			const agentIndex = newAgents.findIndex((item) => item.botId === botId);
			if (agentIndex !== -1) {
				newAgents[agentIndex].messages = messages;
			}
			return newAgents;
		});
	};

	const values = {
		loading,
		agents,
		current,
		setCurrent,
		setAgents,
		updateAgentMessages,
	};

	return (
		<AgentsContext.Provider value={values}>{children}</AgentsContext.Provider>
	);
};

export default AgentsContextProvider;
