import React, { useState } from 'react';
import {
	MobileOutlined,
	GoogleCircleFilled,
	WechatFilled,
} from '@ant-design/icons';
import styles from './index.module.less';
import { Button } from 'antd';
import { noop } from 'lodash';
import useGoogleAuth from '~/hooks/useGoogleAuth';

const Login: React.FC = () => {
	const { startAuth } = useGoogleAuth(location.origin + location.pathname);

	return (
		<div className={styles.loginPage}>
			<div className={styles.loginContainer}>
				<Button
					size='large'
					className={styles.loginButton}
					type='primary'
					onClick={noop}
					icon={<MobileOutlined className={styles.icon} />}
				>
					Sign in with Phone
				</Button>
				<Button
					size='large'
					className={styles.loginButton}
					type='default'
					onClick={startAuth}
					icon={<GoogleCircleFilled className={styles.icon} />}
				>
					Sign in with Google
				</Button>
				<Button
					size='large'
					className={styles.loginButton}
					type='default'
					onClick={noop}
					icon={<WechatFilled className={styles.icon} />}
				>
					Sign in with Wechat
				</Button>
			</div>
		</div>
	);
};

export default Login;
