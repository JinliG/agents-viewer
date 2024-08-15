import {
	SendOutlined,
	ClearOutlined,
	PlusOutlined,
	CloseCircleFilled,
} from '@ant-design/icons';
import { useChat } from 'ai/react';
import { Button, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { groupBy, isEmpty, map, uniqueId } from 'lodash';
import { useState, type FormEvent } from 'react';

import { cozeApiChat, cozeBase, cozeHost } from '~/network/coze';
import type { ChatMessage, ChatReq, FileInfo, MessageType } from '~/types/coze';
import {
	convertInputToEnterMessage,
	formatBytes,
	parseMultiJson,
} from '~/utils';

import ChatMessages from './components/ChatMessages';
import styles from './index.module.less';
import Uploader from './components/Uploader';
import { BotMessage, BotMessageRole } from '~/types';
import classNames from 'classnames';

function getContentId(str: string) {
	return encodeURIComponent(str).replace(/[.*+?^${}()|[\]\\]/g, '-');
}

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

interface ChatPanelProps {
	botId: string;
}
export default function ChatPanel(props: ChatPanelProps) {
	const { botId } = props;
	const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);
	const [fileList, setFileList] = useState<FileInfo[]>([]);

	const {
		messages: streamMessages,
		setMessages: setStreamMessages,
		handleSubmit,
		input,
		handleInputChange,
		stop: stopStream,
	} = useChat({
		streamMode: 'text',
		api: cozeBase + cozeApiChat,
		// 使用 useChat 的钩子并自定义处理可读流逻辑
		onResponse: (response) => {
			setIsWaitingAnswer(true);

			const inputMessageId = getContentId(input + uniqueId());
			// 多模态消息
			const payloadMessages: BotMessage[] = map(fileList, (item) => {
				return {
					id: inputMessageId,
					role: BotMessageRole.User,
					content: '',
					multiModal: item,
				};
			});
			let bufferMessages: BotMessage[] = [
				// 合并之前的 streamMessages
				...(streamMessages as BotMessage[]),
				...payloadMessages,
				// 添加当前输入内容
				{
					id: inputMessageId,
					role: BotMessageRole.User,
					content: input,
				},
			];
			setFileList([]);

			const reader = response.body?.getReader();
			const push = () =>
				reader
					?.read()
					.then(({ done, value }) => {
						if (done === true) {
							setIsWaitingAnswer(false);
							console.log('stream done', bufferMessages);
							return;
						}
						const chunk = new TextDecoder().decode(value);
						const list = parseMultiJson(chunk);
						const groupedByType = groupBy(list, (item) => item?.type);
						const { answer = [], ...rest } = groupedByType as {
							[key in MessageType]: ChatMessage[];
						};
						console.log('--- typed messages', groupedByType);

						bufferMessages = bufferMessages.concat(
							answer.map(({ content, id, role }) => ({
								id,
								role: role as BotMessageRole,
								content: content as string,
							}))
						);

						setStreamMessages(bufferMessages);
						push();
					})
					.catch((e) => {
						console.error('reader error ', e);
						setIsWaitingAnswer(false);
					});
			return push();
		},
		onError(error) {
			console.error(error);
		},
	});

	async function sendMessage(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!streamMessages.length) {
			await new Promise((resolve) => setTimeout(resolve, 300));
		}
		if (isWaitingAnswer) {
			return;
		}

		handleSubmit(e, {
			options: {
				headers: {
					host: cozeHost,
					Authorization: `Bearer ${import.meta.env.VITE_COZE_API_KEY}`,
				},
				body: {
					bot_id: botId,
					// TODO: 单独 userId
					user_id: 'Jinli',
					additional_messages: convertInputToEnterMessage(input, fileList),
					auto_save_history: true,
					stream: true,
				} as ChatReq,
			},
		});
	}

	const clearMessages = () => {
		stopStream();
		setStreamMessages([]);
	};

	const removeFile = (id: string) => {
		setFileList((state) => state.filter((item) => item.id !== id));
	};
	// console.log('--- isWaitingAnswer', isWaitingAnswer);

	return (
		<div className={styles.chatPanel}>
			<div className={styles.messageContainer}>
				<ChatMessages
					streamMessages={streamMessages as BotMessage[]}
					isWaitingAnswer={isWaitingAnswer}
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
					onChange={handleInputChange}
					rows={3}
					// @ts-ignore
					onPressEnter={sendMessage}
					style={{
						resize: 'none',
					}}
				/>
				<div className={styles.innerTools}>
					<Button
						type='text'
						onClick={clearMessages}
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
