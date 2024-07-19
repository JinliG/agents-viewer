import { SendOutlined, ClearOutlined } from '@ant-design/icons';
import { useChat, type Message } from 'ai/react';
import { Button, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { groupBy, isEmpty, uniqueId } from 'lodash';
import { useState, type FormEvent } from 'react';

import { cozeApiChat, cozeBase, cozeHost } from '~/network/coze/apis';
import type { ChatMessage, ChatReq, MessageType } from '~/types/coze';
import { convertInputToEnterMessage, parseMultiJson } from '~/utils';

import ChatMessages from './components/ChatMessages';
import styles from './index.module.less';

function getContentId(str: string) {
	return encodeURIComponent(str).replace(/[.*+?^${}()|[\]\\]/g, '-');
}

interface ChatPanelProps {
	botId: string;
}

export default function ChatPanel(props: ChatPanelProps) {
	const { botId } = props;
	const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);
	const [messageCards, setMessageCards] = useState<any[]>([]);

	const {
		messages: streamMessages,
		setMessages: setStreamMessages,
		handleSubmit,
		input,
		handleInputChange,
		isLoading,
		stop: stopStream,
	} = useChat({
		streamMode: 'text',
		api: cozeBase + cozeApiChat,
		// 使用 useChat 的钩子并自定义处理可读流逻辑
		onResponse: (response) => {
			setIsWaitingAnswer(true);
			// 合并之前的 streamMessages
			let bufferMessages: Message[] = [
				...streamMessages,
				{
					id: getContentId(input + uniqueId()),
					role: 'user',
					content: input,
				},
			];
			const reader = response.body?.getReader();
			const push = () =>
				reader
					?.read()
					.then(({ done, value }) => {
						if (done === true) {
							setIsWaitingAnswer(false);
							console.log('--- 读取完毕', bufferMessages);
							return;
						}
						const chunk = new TextDecoder().decode(value);
						const list = parseMultiJson(chunk);
						const groupedByType = groupBy(list, (item) => item?.type);
						console.log('--- typed messages', groupedByType);
						const { answer = [], ...rest } = groupedByType as {
							[key in MessageType]: ChatMessage[];
						};

						setMessageCards((state) => [...state, rest]);
						bufferMessages = bufferMessages.concat(
							answer.map(({ content, chat_id, role }) => ({
								id: chat_id,
								role,
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
		if (isLoading) {
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
					user_id: 'Jinli',
					additional_messages: convertInputToEnterMessage(input),
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

	// console.log('--- isWaitingAnswer', isWaitingAnswer, streamMessages);

	return (
		<div className={styles.chatPanel}>
			<div className={styles.messageContainer}>
				<ChatMessages
					streamMessages={streamMessages}
					isWaitingAnswer={isWaitingAnswer}
				/>
			</div>
			<div className={styles.inputContainer}>
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
	);
}
