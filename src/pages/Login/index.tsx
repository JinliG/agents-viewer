import React from 'react';
import {
	MobileOutlined,
	GoogleCircleFilled,
	WechatFilled,
} from '@ant-design/icons';
import styles from './index.module.less';
import { Button } from 'antd';
import { noop } from 'lodash';
import useGoogleAuth from '~/hooks/useGoogleAuth';
import { useAuthContext } from '~/context/AuthContextProvider';
import { mockUser } from '~/constant';

const Login: React.FC = () => {
	const { startAuth, loading: googleAuthorizing } = useGoogleAuth(
		location.origin + location.pathname
	);
	const { loginCallback } = useAuthContext();

	const onMockUser = () => {
		loginCallback(mockUser, 'mock');
	};

	return (
		<div className={styles.loginPage}>
			<Button type='primary' onClick={onMockUser}>
				使用Mock登录
			</Button>
			<div className={styles.loginContainer}>
				<Button
					size='large'
					className={styles.loginButton}
					type='primary'
					onClick={noop}
					icon={<MobileOutlined className={styles.icon} />}
					disabled
				>
					Sign in with Phone
				</Button>
				<Button
					size='large'
					className={styles.loginButton}
					type='default'
					onClick={startAuth}
					icon={<GoogleCircleFilled className={styles.icon} />}
					loading={googleAuthorizing}
					disabled
				>
					Sign in with Google
				</Button>
				<Button
					size='large'
					className={styles.loginButton}
					type='default'
					onClick={noop}
					icon={<WechatFilled className={styles.icon} />}
					disabled
				>
					Sign in with Wechat
				</Button>
			</div>
		</div>
	);
};

export default Login;
