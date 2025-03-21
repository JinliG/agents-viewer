import { useMount, useUnmount } from 'ahooks';
import { useMemo, useState } from 'react';
import { client } from '~/network/coze';
import {
	ChatEventType,
	ChatV3Message,
	Conversation,
	StreamChatReq,
} from '@coze/api';
import { convertInputToEnterMessage } from '~/utils';
import { useAgentsContext } from '~/context/AgentsContextProvider';
import { useAuthContext } from '~/context/AuthContextProvider';

interface StreamHandlerResult {
	input: string;
	processing: boolean;
	chatMessages: ChatV3Message[];
	error?: Error;
	streamChat: (
		input: string,
		fileList?: any[],
		options?: StreamChatReq
	) => void;
	stopStream: () => void;
	setChatMessages: React.Dispatch<React.SetStateAction<ChatV3Message[]>>;
	clearChatMessages: () => void;
	setInput: React.Dispatch<React.SetStateAction<string>>;
}

interface IProps {
	botId?: string;
}
export function useStreamHandler({ botId }: IProps = {}): StreamHandlerResult {
	const { updateAgentMessages } = useAgentsContext();
	const { userInfo } = useAuthContext();

	const [conversation, setConversation] = useState<Conversation>();
	const [processing, setProcessing] = useState(false);
	const [chatMessages, setChatMessages] = useState<ChatV3Message[]>([]);
	const [input, setInput] = useState<string>();
	const [error, setError] = useState<Error>();

	const clearChatMessages = () => {
		stopStream();
		updateAgentMessages(botId, []);
	};

	const stopStream = () => {
		// TODO: stop stream
		setProcessing(false);
	};

	useMount(async () => {
		const newConversation = await client.conversations.create({
			bot_id: botId || import.meta.env.VITE_COZE_GLOBAL_BOT,
		});
		setConversation(newConversation);
	});

	// 流处理逻辑
	const streamChat = async (
		input: string,
		fileList?: any[],
		options?: StreamChatReq
	) => {
		setProcessing(true);
		setChatMessages([]);

		try {
			const stream = await client.chat.stream({
				conversation_id: conversation?.id,
				bot_id: botId || import.meta.env.VITE_COZE_GLOBAL_BOT,
				user_id: userInfo?.id,
				additional_messages: convertInputToEnterMessage(input, fileList),
				auto_save_history: true,
				...options,
			});

			for await (const part of stream) {
				if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
					setChatMessages((prev) => [...prev, part.data]);
				}
			}
		} catch (e) {
			setError(e);
		} finally {
			setProcessing(false);
		}
	};

	// 卸载时清理状态
	useUnmount(() => {
		setChatMessages([]);
	});

	return useMemo(
		() => ({
			conversation,
			input,
			chatMessages,
			processing,
			error,
			streamChat,
			stopStream,
			setChatMessages,
			clearChatMessages,
			setInput,
		}),
		[input, chatMessages, processing, error, conversation]
	);
}
