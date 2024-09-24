import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import {
	CrxMessageRequest,
	CrxMessageTypesMap,
	CrxSourceMap,
	GlobalOptions,
} from '../types';
import { Col, Row, Menu } from 'antd';
import { MenuItemType } from 'antd/es/menu/interface';
import { find } from 'lodash';
import SectionKitOptionsPanel from './components/SectionKit';

interface OptionMenu extends MenuItemType {
	Content: React.FC<any>;
}

export interface ContentPanelProps {
	globalOptions: GlobalOptions;
	refetchOptions: () => void;
}

const Options: React.FC = () => {
	const menuItems: OptionMenu[] = [
		{
			key: 'common',
			label: '通用配置',
			Content: SectionKitOptionsPanel,
		},
		{
			key: 'sectionKit',
			label: '快捷菜单',
			Content: SectionKitOptionsPanel,
		},
		{
			key: 'botsMarket',
			label: 'Agents 市场',
			Content: SectionKitOptionsPanel,
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
					console.log('--- response', response);
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
			<Row justify='center' align='top' gutter={[24, 24]}>
				<Col span={4}>
					<div className={styles.sider}>
						<Menu
							className={styles.menu}
							defaultActiveFirst
							mode='vertical'
							onClick={onMenuItemClick}
							items={menuItems.map((item) => ({
								key: item.key,
								label: item.label,
							}))}
						/>
					</div>
				</Col>
				<Col span={20}>
					<div className={styles.contentWrapper}>
						<div className={styles.title}>{label}</div>
						<div className={styles.content}>
							<Content
								globalOptions={globalOptions}
								refetchOptions={handleGetGlobalOptions}
							/>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default Options;
