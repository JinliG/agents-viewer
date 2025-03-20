import { Avatar, Descriptions, DescriptionsProps, Space } from 'antd';
import React from 'react';
import { useAuthContext } from '~/context/AuthContextProvider';
import styles from './index.module.less';

const CommonOptionsPanel: React.FC<any> = () => {
	const { userInfo } = useAuthContext();
	const items: DescriptionsProps['items'] = [
		{
			key: 'name',
			label: '用户名',
			children: userInfo?.name,
		},
		{
			key: 'phone',
			label: '手机号',
			children: userInfo?.phone,
		},
		{
			key: 'email',
			label: 'Email',
			children: userInfo?.email,
		},
	];

	return (
		<div className={styles.container}>
			<div className={styles.section}>用户信息</div>
			<Space direction='vertical' size={16}>
				<Avatar size={64} src={userInfo?.avatar} />
				<Descriptions column={2} layout='vertical' items={items} />
			</Space>
		</div>
	);
};
export default CommonOptionsPanel;
