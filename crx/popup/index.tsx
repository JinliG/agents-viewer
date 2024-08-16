import React, { useEffect, useState } from 'react';
import { Switch } from 'antd';
import styles from './index.module.less';
import { CrxMessages } from '../constant';
import { CrxSetting } from '../types';

const Popup: React.FC = () => {
	const [crxSetting, setCrxSetting] = useState<CrxSetting>({
		bubble: true,
		translateMode: ['all', 'zh'],
	});

	useEffect(() => {
		chrome.runtime.sendMessage(
			{ type: CrxMessages.GET_CRX_SETTING },
			(response) => {
				console.log('--- res', response);
			}
		);
	}, []);

	const handleBubbleToggle = (key, value) => {
		setCrxSetting((prevState) => ({
			...prevState,
			[key]: value,
		}));
		chrome.runtime.sendMessage({
			type: CrxMessages.UPDATE_CRX_SETTING,
			setting: {
				...crxSetting,
				[key]: value,
			},
		});
	};

	return (
		<div className={styles.popup}>
			<div className={styles.section}>
				<label htmlFor='bubble-switch' className={styles.label}>
					快捷气泡
				</label>
				<Switch
					id='bubble-switch'
					className={styles.switch}
					checkedChildren='开'
					unCheckedChildren='关'
					checked={crxSetting.bubble}
					onChange={(checked) => handleBubbleToggle('bubble', checked)}
				/>
			</div>
			<footer className={styles.footer}>
				<a
					href='https://example.com/help'
					target='_blank'
					rel='noopener noreferrer'
				>
					帮助文档
				</a>
			</footer>
		</div>
	);
};

export default Popup;
