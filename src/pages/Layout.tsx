import { PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Image, Tooltip } from 'antd';
import classNames from 'classnames';
import { map } from 'lodash';
import React from 'react';

import { useAuthContext } from '~/context/AuthContextProvider';
import AgentsContextProvider, {
	useAgentsContext,
} from '~/context/AgentsContextProvider';

import styles from './Layout.module.less';

const Layout: React.FC<any> = () => {
	const {
		agents,
		setCurrent: setCurrentAgent,
		current: currentAgent,
	} = useAgentsContext();
	const { userInfo, isChromeExtension } = useAuthContext();

	const { Comp, name, botId } = currentAgent || {};

	const onOpenOptions = () => {
		if (isChromeExtension) {
			chrome.runtime.openOptionsPage();
		}
	};

	return (
		<div className={styles.layout}>
			<div className={styles.main}>
				<div className={styles.title}>{name}</div>
				<div className={styles.comp}>{Comp && <Comp botId={botId} />}</div>
			</div>
			<div className={styles.sider}>
				<div className={styles.agentList}>
					{map(agents, (agent, index) => {
						const { icon, name, active } = agent;
						const isCurrent = currentAgent?.key === agent.key;

						if (active === false) {
							return null;
						}

						return (
							<Tooltip trigger={'hover'} placement='left' title={name}>
								<div
									key={index}
									className={classNames(
										styles.block,
										isCurrent && styles.active
									)}
									onClick={() => setCurrentAgent(agent)}
								>
									<Image preview={false} src={icon} className={styles.icon} />
								</div>
							</Tooltip>
						);
					})}
					<PlusCircleOutlined
						style={{ fontSize: 24 }}
						onClick={onOpenOptions}
					/>
				</div>
				<div className={styles.setting}>
					<SettingOutlined style={{ fontSize: 24 }} onClick={onOpenOptions} />
					<Avatar size={28} src={userInfo?.avatar} onClick={onOpenOptions} />
				</div>
			</div>
		</div>
	);
};

export default (props) => (
	<AgentsContextProvider>
		<Layout {...props} />
	</AgentsContextProvider>
);
