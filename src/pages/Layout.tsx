import { PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Image, Tooltip } from 'antd';
import classNames from 'classnames';
import { map } from 'lodash';
import React from 'react';

import { useAuthContext } from '~/context/AuthContextProvider';
import { useFeaturesContext } from '~/context/FeaturesContextProvider';

import styles from './Layout.module.less';

const Layout: React.FC<any> = () => {
	const { features, setCurrentFeature, currentFeature } = useFeaturesContext();
	const { userInfo } = useAuthContext();

	console.log('--- features', features, currentFeature);
	const { Comp, name, botId } = currentFeature || {};

	return (
		<div className={styles.layout}>
			<div className={styles.main}>
				<div className={styles.title}>{name}</div>
				<div className={styles.comp}>{Comp && <Comp botId={botId} />}</div>
			</div>
			<div className={styles.sider}>
				<div className={styles.features}>
					{map(features, (feature, index) => {
						const { icon, name } = feature;
						const isCurrent = currentFeature?.key === feature.key;
						return (
							<Tooltip trigger={'hover'} title={name}>
								<div
									key={index}
									className={classNames(
										styles.block,
										isCurrent && styles.active
									)}
									onClick={() => setCurrentFeature(feature)}
								>
									<Image preview={false} src={icon} className={styles.icon} />
								</div>
							</Tooltip>
						);
					})}
					<PlusCircleOutlined style={{ fontSize: 24 }} />
				</div>
				<div className={styles.setting}>
					<SettingOutlined style={{ fontSize: 24 }} />
					<Avatar size={28} src={userInfo?.avatar} />
				</div>
			</div>
		</div>
	);
};
export default Layout;
