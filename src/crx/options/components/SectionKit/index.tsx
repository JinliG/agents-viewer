import {
	Button,
	Card,
	Form,
	Image,
	Input,
	Modal,
	Radio,
	Space,
	Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
	CrxMessageRequest,
	CrxMessageTypesMap,
	CrxSourceMap,
	GlobalOptions,
	KitFeature,
	SectionKitOptions,
} from '~/crx/types';
import styles from './index.module.less';
import classNames from 'classnames';
import { useForm } from 'antd/es/form/Form';
import FeatureManager from './FeatureManager';
import { ContentPanelProps } from '../..';

const SectionKitOptionsPanel: React.FC<ContentPanelProps> = ({
	globalOptions,
	refetchOptions,
}) => {
	const [form] = useForm();

	const [sectionKitOptions, setSectionKitOptions] =
		useState<SectionKitOptions>();
	const [isModalVisible, setIsModalVisible] = useState(false);

	useEffect(() => {
		setSectionKitOptions(globalOptions?.sectionKit);
	}, [globalOptions?.sectionKit]);

	const { triggerMode, writeHelper, kitFeatures } = sectionKitOptions || {};

	const handleUpdateSectionKitOptions = (values, callback?: () => void) => {
		chrome.runtime.sendMessage(
			{
				type: CrxMessageTypesMap.UPDATE_GLOBAL_OPTIONS,
				source: CrxSourceMap.OPTIONS,
				payload: {
					...globalOptions,
					sectionKit: {
						...sectionKitOptions,
						...values,
					},
				},
			} as CrxMessageRequest,
			(response: GlobalOptions) => {
				if (response) {
					callback?.();
				}
			}
		);
	};

	const closeModal = () => {
		form.resetFields();
		setIsModalVisible(false);
	};

	const handleModalOk = () => {
		form
			.validateFields()
			.then((values) => {
				const { name, description, prompt, isCollapsed } = values;
				const newKitFeature: KitFeature = {
					key: name,
					label: name,
					prompt,
					isCollapsed,
					description,
					isDefault: false,
				};
				handleUpdateSectionKitOptions(
					{
						kitFeatures: [...kitFeatures, newKitFeature],
					},
					() => {
						refetchOptions();
						closeModal();
					}
				);
			})
			.catch((errorInfo) => {
				console.log('Failed:', errorInfo);
			});
	};

	return (
		<div className={styles.container}>
			<div className={styles.section}>
				<div className={styles.title}>触发</div>
				<div className={styles.flex}>
					<Card
						cover={<Image src='https://s4.ax1x.com/2021/12/22/TQT3rj.png' />}
					>
						<Radio checked={triggerMode === 'auto'}>
							<div>划词立刻展示</div>
						</Radio>
					</Card>
					<Card
						cover={<Image src='https://s4.ax1x.com/2021/12/22/TQT3rj.png' />}
					>
						<Radio checked={triggerMode === 'manual'}>
							<div>划词后快捷键展示</div>
						</Radio>
					</Card>
				</div>
			</div>
			<div className={styles.section}>
				<div className={styles.title}>写作助手</div>
				<Card cover={<Image src='https://s4.ax1x.com/2021/12/22/TQT3rj.png' />}>
					<Space>
						<Switch checked={writeHelper}></Switch>
						在编辑器内启动写作助手
					</Space>
				</Card>
			</div>
			<div className={styles.section}>
				<div className={classNames(styles.flex, styles.title)}>
					<div>快捷菜单工具</div>
					<Button onClick={() => setIsModalVisible(true)}>自定义工具</Button>
				</div>
				<FeatureManager
					kitFeatures={kitFeatures}
					updateSectionKitOptions={handleUpdateSectionKitOptions}
				/>
			</div>
			<Modal
				title='新建自定义工具'
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={closeModal}
			>
				<Form
					form={form}
					layout='vertical'
					initialValues={{
						name: '',
						description: '',
						isCollapsed: false,
						prompt: '',
					}}
				>
					<Form.Item
						name='name'
						label='名称'
						rules={[{ required: true, message: '请输入名称' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name='prompt'
						label='提示词'
						rules={[{ required: true, message: '请输入提示词' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
					<p style={{ marginTop: 8 }}>
						{`提示词中使用 {{selection}} 代表划词的内容`}
					</p>
					<Form.Item
						name='isCollapsed'
						label='是否折叠'
						valuePropName='checked'
					>
						<Switch />
					</Form.Item>
					<Form.Item name='description' label='描述'>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
export default SectionKitOptionsPanel;
