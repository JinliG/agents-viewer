import { Card, Flex, Image, Radio } from 'antd';
import { map } from 'lodash';
import React from 'react';
import { useAgentsContext } from '~/context/AgentsContextProvider';
import styles from './index.module.less';

const AgentMarket: React.FC<any> = () => {
	const { agents, setAgents } = useAgentsContext();

	const onTriggerAgentActive = (id) => {
		setAgents((state) => {
			return state.map((item) => {
				if (item.botId === id) {
					return {
						...item,
						active: !item.active,
					};
				}
				return item;
			});
		});
	};

	return (
		<div className={styles.container}>
			<Flex gap={16} wrap='wrap'>
				{map(agents, (agent) => {
					const { botAvatar, botId, icon, name } = agent;

					return (
						<Card
							className={styles.agentCard}
							size='small'
							key={botId}
							hoverable
							cover={
								<Image
									src={botAvatar || icon}
									preview={false}
									width={64}
									height={64}
									wrapperClassName={styles.image}
									alt={name}
								/>
							}
							onClick={() => onTriggerAgentActive(botId)}
						>
							<Card.Meta className={styles.meta} title={name} />
							<Radio className={styles.trigger} checked={agent.active} />
						</Card>
					);
				})}
			</Flex>
		</div>
	);
};
export default AgentMarket;
