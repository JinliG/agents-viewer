import React, { useEffect, useState } from 'react';
import styles from './app.module.less';
import {
	CrxMessageRequest,
	CrxMessageTypesMap,
	CrxSourceMap,
	GlobalOptions,
} from '../types';
import { Col, Row, Menu, Button, Space, Flex } from 'antd';
import { find } from 'lodash';
import SectionKitOptionsPanel from './components/SectionKit';
import CommonOptionsPanel from './components/Common';
import AgentMarket from './components/AgentMarket';
import { toast } from 'react-toastify';
import '~/styles/index.less';

interface OptionMenu {
	key: string;
	label: string;
	Content: React.FC<any>;
}

export interface ContentPanelProps {
	globalOptions: GlobalOptions;
	setGlobalOptions: React.Dispatch<React.SetStateAction<GlobalOptions>>;
	refetchOptions: () => void;
}

const Options: React.FC = () => {
	const menuItems: OptionMenu[] = [
		{
			key: 'common',
			label: '通用配置',
			Content: CommonOptionsPanel,
		},
		{
			key: 'sectionKit',
			label: '快捷菜单',
			Content: SectionKitOptionsPanel,
		},
		{
			key: 'agentMarket',
			label: 'Agents 市场',
			Content: AgentMarket,
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
					toast.success('保存成功');
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
	const showSave = [
		menuItems[0].key,
		menuItems[1].key,
		menuItems[2].key,
	].includes(currentMenu?.key);

	return (
		<div className={styles.options}>
			<Row
				justify='center'
				align='top'
				gutter={[24, 24]}
				style={{
					height: '100%',
				}}
			>
				<Col span={4}>
					<div className={styles.sider}>
						<Menu
							className={styles.menu}
							mode='vertical'
							onClick={onMenuItemClick}
							defaultSelectedKeys={[currentMenu?.key]}
							activeKey={currentMenu?.key}
							items={menuItems.map((item) => ({
								key: item.key,
								label: item.label,
							}))}
						/>
					</div>
				</Col>
				<Col
					span={20}
					style={{
						height: '100%',
					}}
				>
					<div className={styles.contentWrapper}>
						<Flex className={styles.header} justify='space-between'>
							<div className={styles.title}>{label}</div>
							<Space>
								{showSave && (
									<Button type='primary' onClick={handleUpdateGlobalOptions}>
										保存
									</Button>
								)}
							</Space>
						</Flex>
						<div className={styles.content}>
							<Content
								globalOptions={globalOptions}
								setGlobalOptions={setGlobalOptions}
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
