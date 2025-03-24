import { useMount, useUnmount } from 'ahooks';
import { useMemo, useState } from 'react';
import { client } from '~/network/coze';
import {
	ChatEventType,
	ChatV3Message,
	Conversation,
	StreamChatReq,
	FileObject,
	RoleType,
} from '@coze/api';
import { convertInputToEnterMessage } from '~/utils';
import { useAgentsContext } from '~/context/AgentsContextProvider';
import { useAuthContext } from '~/context/AuthContextProvider';
import { map, uniqueId } from 'lodash';
import { FileInfo } from '~/types';

function getContentId(str: string) {
	return encodeURIComponent(str).replace(/[.*+?^${}()|[\]\\]/g, '-');
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface StreamMessage
	extends PartialBy<
		ChatV3Message,
		'meta_data' | 'created_at' | 'updated_at' | 'type'
	> {
	[key: string]: any;
}

interface StreamHandlerResult {
	processing: boolean;
	streamMessages: StreamMessage[];
	followUpList: StreamMessage[];
	fileObjects: FileObject[];
	error?: Error;
	singleStreamChat: (
		input: string,
		fileList?: FileInfo[],
		options?: StreamChatReq
	) => Promise<string>;
	streamChat: (
		input: string,
		fileList?: FileInfo[],
		options?: StreamChatReq
	) => void;
	stopStream: () => void;
	setStreamMessages: React.Dispatch<React.SetStateAction<StreamMessage[]>>;
	clearStreamMessages: () => void;
	setFileObjects: React.Dispatch<React.SetStateAction<FileObject[]>>;
}

interface IProps {
	botId?: string;
}
export function useStreamHandler({
	botId = import.meta.env.VITE_COZE_GLOBAL_BOT,
}: IProps = {}): StreamHandlerResult {
	const { updateAgentMessages } = useAgentsContext();
	const { userInfo } = useAuthContext();

	const [conversation, setConversation] = useState<Conversation>();
	// 流式消息
	const [streamMessages, setStreamMessages] = useState<StreamMessage[]>([]);
	const [followUpList, setFollowUpList] = useState<StreamMessage[]>([]);
	const [processing, setProcessing] = useState(false);
	const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
	const [error, setError] = useState<Error>();

	const clearStreamMessages = () => {
		stopStream();
		setStreamMessages([]);
		updateAgentMessages(botId, []);
	};

	const stopStream = () => {
		// TODO: stop stream
		setProcessing(false);
	};

	useMount(async () => {
		const newConversation = await client.conversations.create({
			bot_id: botId,
		});
		setConversation(newConversation);
	});

	const generateInputChatMessages = (input: string) => {
		const inputMessageId = getContentId(input + uniqueId());

		// 多模态消息
		const payloadMessages = map<any, StreamMessage>(fileObjects, (item) => {
			return {
				id: inputMessageId,
				role: RoleType.User,
				content: '',
				multiModal: item,
				chat_id: inputMessageId,
				conversation_id: conversation?.id,
				bot_id: botId,
				content_type: 'object_string',
			};
		});

		const bufferMessages: StreamMessage[] = [
			...payloadMessages,
			// 添加当前输入内容
			{
				id: inputMessageId,
				role: RoleType.User,
				content: input,
				chat_id: inputMessageId,
				conversation_id: conversation?.id,
				bot_id: botId,
				content_type: 'text',
			},
		];
		setFileObjects([]);

		return bufferMessages;
	};

	// 流式对话
	const streamChat = async (
		input: string,
		files?: any[],
		options?: StreamChatReq
	) => {
		setProcessing(true);
		setFollowUpList([]);

		try {
			const stream = await client.chat.stream({
				conversation_id: conversation?.id,
				bot_id: botId,
				user_id: userInfo?.id,
				additional_messages: convertInputToEnterMessage(input, files),
				auto_save_history: true,
				...options,
			});

			const inputChatMessages = generateInputChatMessages(input);
			setStreamMessages((prev) => [...prev, ...inputChatMessages]);

			for await (const part of stream) {
				if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
					setStreamMessages((prev) => [...prev, part.data]);
				}

				if (
					part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED &&
					part.data.type === 'follow_up'
				) {
					setFollowUpList((prev) => [...prev, part.data]);
				}
			}
		} catch (e) {
			setError(e);
		} finally {
			setProcessing(false);
		}
	};

	// 单次流处理逻辑
	const singleStreamChat = async (
		input: string,
		files?: any[],
		options?: StreamChatReq
	) => {
		setProcessing(true);
		setStreamMessages([]);

		try {
			const stream = await client.chat.stream({
				conversation_id: conversation?.id,
				bot_id: botId,
				user_id: userInfo?.id,
				additional_messages: convertInputToEnterMessage(input, files),
				auto_save_history: true,
				...options,
			});

			let answer = '';
			for await (const part of stream) {
				if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
					setStreamMessages((prev) => [...prev, part.data]);
					answer += part.data.content;
				}
			}
			return answer;
		} catch (e) {
			setError(e);
		} finally {
			setProcessing(false);
		}
	};

	// 卸载时清理状态
	useUnmount(() => {
		setStreamMessages([]);
	});

	return useMemo(
		() => ({
			conversation,
			streamMessages,
			followUpList,
			processing,
			error,
			fileObjects,
			singleStreamChat,
			streamChat,
			stopStream,
			setStreamMessages,
			clearStreamMessages,
			setFileObjects,
		}),
		[streamMessages, followUpList, processing, error, conversation, fileObjects]
	);
}
