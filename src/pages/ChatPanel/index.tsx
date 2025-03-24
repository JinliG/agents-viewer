import {
	SendOutlined,
	ClearOutlined,
	PlusOutlined,
	CloseCircleFilled,
} from '@ant-design/icons';
import { Button, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { isEmpty, map } from 'lodash';
import { useEffect, useState, type FormEvent } from 'react';

import ChatMessages from './components/ChatMessages';
import styles from './index.module.less';
import Uploader from './components/Uploader';
import classNames from 'classnames';
import { useAgentsContext } from '~/context/AgentsContextProvider';
import { useStreamHandler } from '~/hooks/useStreamHandler';
import { FileInfo } from '~/types';
import { formatBytes } from '~/utils';

interface FileCardProps extends React.HTMLAttributes<HTMLDivElement> {
	file: FileInfo;
	allowRemove?: boolean;
	onRemove?: (id: string) => void;
}
export const FileCard: React.FC<FileCardProps> = ({
	file,
	allowRemove = true,
	onRemove,
	className,
}) => {
	const { file_name, bytes, id } = file;
	return (
		<div className={classNames(styles.fileCard, className)} key={id}>
			{allowRemove && (
				<div className={styles.remove} onClick={() => onRemove?.(id)}>
					<CloseCircleFilled style={{ color: 'rgba(0,0,0, .8)' }} />
				</div>
			)}
			<div>
				<div className={styles.coTitle}>{file_name}</div>
				<div className={styles.desc}>{formatBytes(bytes)}</div>
			</div>
		</div>
	);
};

let lastBotId;
interface ChatPanelProps {
	botId: string;
}
export default function ChatPanel(props: ChatPanelProps) {
	const { botId } = props;
	const { updateAgentMessages, current } = useAgentsContext();
	const {
		streamChat,
		processing,
		streamMessages,
		setStreamMessages,
		clearStreamMessages,
	} = useStreamHandler({ botId });

	const [fileList, setFileList] = useState<FileInfo[]>([]);
	const [input, setInput] = useState('');

	useEffect(() => {
		if (lastBotId) {
			updateAgentMessages(lastBotId, streamMessages);
		}
		setStreamMessages(current.messages || []);
		lastBotId = botId;
	}, [botId]);

	async function sendMessage(e: FormEvent<any>) {
		e.preventDefault();
		if (!streamMessages.length) {
			await new Promise((resolve) => setTimeout(resolve, 300));
		}
		if (processing) {
			return;
		}

		setInput('');
		await streamChat(input, fileList);
	}

	const removeFile = (id: string) => {
		setFileList((state) => state.filter((item) => item.id !== id));
	};

	return (
		<div className={styles.chatPanel}>
			<div className={styles.messageContainer}>
				<ChatMessages
					streamMessages={streamMessages}
					isWaitingAnswer={processing}
				/>
			</div>
			<div className={styles.inputContainer}>
				{!isEmpty(fileList) && (
					<div className={styles.fileArea}>
						{map(fileList, (item) => {
							return <FileCard file={item} onRemove={removeFile} />;
						})}
					</div>
				)}
				<TextArea
					className={styles.inputArea}
					placeholder='输入消息...'
					value={input}
					autoSize={false}
					onChange={(e) => setInput(e.target.value)}
					rows={3}
					onPressEnter={sendMessage}
					style={{
						resize: 'none',
					}}
				/>
				<div className={styles.innerTools}>
					<Button
						type='text'
						onClick={clearStreamMessages}
						icon={<ClearOutlined />}
					/>
					<div className={styles.right}>
						<Uploader
							onUploadSuccess={(file) =>
								setFileList((state) => [...state, file])
							}
						>
							<Button type='text' icon={<PlusOutlined />} />
						</Uploader>
						<Form onSubmitCapture={sendMessage}>
							<Button
								htmlType='submit'
								type='text'
								className={styles.sendIcon}
								icon={<SendOutlined />}
							/>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}
