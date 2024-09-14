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
	Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { GlobalOptions, SectionKitOptions } from '~/crx/types';
import styles from './index.module.less';
import { map } from 'lodash';
import classNames from 'classnames';
import { useForm } from 'antd/es/form/Form';

interface SectionKitOptionsPanelProps {
	globalOptions?: GlobalOptions;
}
const SectionKitOptionsPanel: React.FC<SectionKitOptionsPanelProps> = ({
	globalOptions,
}) => {
	const { sectionKit } = globalOptions || {};
	const [form] = useForm();

	const [sectionKitOptions, setSectionKitOptions] =
		useState<SectionKitOptions>();
	const [isModalVisible, setIsModalVisible] = useState(false);

	useEffect(() => {
		setSectionKitOptions(sectionKit);
	}, [sectionKit]);

	const { triggerMode, writeHelper, kitFeatures } = sectionKitOptions || {};

	const handleModalOk = () => {
		form
			.validateFields()
			.then((values) => {
				// TODO: 提交数据
			})
			.catch((errorInfo) => {
				console.log('Failed:', errorInfo);
			});
	};

	const handleModalCancel = () => {
		setIsModalVisible(false);
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
					<Button>自定义工具</Button>
				</div>
				<Space className={styles.manager}>
					{map(kitFeatures, ({ key, label, description, isDefault }) => {
						return (
							<Card
								className={styles.card}
								key={key}
								size='small'
								title={
									<Space>
										<div>{label}</div>
										{isDefault && <Tag style={{ fontWeight: 400 }}>预置</Tag>}
									</Space>
								}
								extra={
									<Space>
										是否折叠
										<Switch />
									</Space>
								}
							>
								<pre>{description}</pre>
							</Card>
						);
					})}
				</Space>
			</div>
			<Modal
				title='新建自定义工具'
				open={isModalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
			>
				<Form
					form={form}
					layout='vertical'
					initialValues={{
						name: '',
						description: '',
						isCollapsed: false,
						placeholder: '',
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
						name='placeholder'
						label='提示词'
						rules={[{ required: true, message: '请输入提示词' }]}
					>
						<Input.TextArea rows={4} />
						<p style={{ marginTop: 8 }}>
							{`提示词中使用 {{selection}} 代表划词的内容`}
						</p>
					</Form.Item>
					<Form.Item
						name='isCollapsed'
						label='是否折叠'
						valuePropName='checked'
					>
						<Switch />
					</Form.Item>
					<Form.Item
						name='description'
						label='描述'
						rules={[{ required: true, message: '请输入描述' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
export default SectionKitOptionsPanel;
