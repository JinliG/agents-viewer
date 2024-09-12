import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import {
	CrxMessageRequest,
	CrxMessageTypesMap,
	CrxSourceMap,
	GlobalOptions,
} from '../types';
import { Col, Row, Menu, Card } from 'antd';
import { MenuItemType } from 'antd/es/menu/interface';
import { find } from 'lodash';

interface OptionMenu extends MenuItemType {
	Content: React.FC<any>;
}

const Options: React.FC = () => {
	const menuItems: OptionMenu[] = [
		{
			key: 'common',
			label: '通用配置',
			Content: React.lazy(() => import('./components/Common')),
		},
		{
			key: 'sectionKit',
			label: '快捷菜单',
			Content: React.lazy(() => import('./components/SectionKit')),
		},
		{
			key: 'botsMarket',
			label: 'Agents 市场',
			Content: React.lazy(() => import('./components/BotsMarket')),
		},
	];

	const [globalOptions, setGlobalOptions] = useState<GlobalOptions>();
	const [currentMenu, setCurrentMenu] = useState<OptionMenu>(menuItems[0]);

	const handleUpdateGlobalOptions = () => {
		chrome.runtime.sendMessage(
			{
				type: CrxMessageTypesMap.UPDATE_GLOBAL_OPTIONS,
				source: CrxSourceMap.OPTIONS,
				payload: globalOptions,
			} as CrxMessageRequest,
			(response: GlobalOptions) => {
				if (response) {
					setGlobalOptions(response);
				}
			}
		);
	};

	const handleGetGlobalOptions = () => {
		chrome.runtime.sendMessage(
			{
				type: CrxMessageTypesMap.GET_GLOBAL_OPTIONS,
				source: CrxSourceMap.OPTIONS,
			} as CrxMessageRequest,
			(response: GlobalOptions) => {
				if (response) {
					setGlobalOptions(response);
				}
			}
		);
	};

	useEffect(() => {
		handleGetGlobalOptions();
	}, []);

	const onMenuItemClick = (item) => {
		setCurrentMenu(find(menuItems, (i) => i.key === item.key));
	};

	const { label, Content } = currentMenu || {};

	return (
		<div className={styles.options}>
			<Row justify='center' align='middle' gutter={[24, 24]}>
				<Col span={4} className={styles.sider}>
					<Menu
						className={styles.menu}
						mode='vertical'
						onClick={onMenuItemClick}
						items={menuItems.map((item) => ({
							key: item.key,
							label: item.label,
						}))}
					/>
				</Col>
				<Col span={16} className={styles.content}>
					<Card title={label}>
						<Content />
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Options;
