import { createAxiosInstance } from '~/network/instance';
import type {
	ChatReq,
	Conversation,
	CozeAPIResponse,
	EnterMessage,
	FileInfo,
	MetaDataType,
	SimpleBot,
} from '~/types/coze';
import { convertInputToEnterMessage } from '~/utils';
import {
	CozeAPI,
	ChatEventType,
	RoleType,
	ChatStatus,
	StreamChatReq,
} from '@coze/api';

export const cozeBase = 'https://api.coze.cn';
export const cozeHost = 'api.coze.cn';
export const cozeApiChat = '/v3/chat';

export const client = new CozeAPI({
	token: import.meta.env.VITE_COZE_API_KEY,
	baseURL: cozeBase,
	allowPersonalAccessTokenInBrowser: true,
});

// export async function streamChat() {
// 	const stream = await client.chat.stream({
// 		bot_id: 'your_bot_id',
// 		additional_messages: [
// 			{
// 				role: RoleType.User,
// 				content: 'Hello!',
// 				content_type: 'text',
// 			},
// 		],
// 	});

// 	for await (const part of stream) {
// 		if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
// 			process.stdout.write(part.data.content); // Real-time response
// 		}
// 	}
// }

export const fetchHandler = async (
	path: string,
	options?: RequestInit
): Promise<Response> => {
	const fullUrl = new URL(path, cozeBase).toString();
	return fetch(fullUrl, {
		...options,
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_COZE_API_KEY}`,
			'Content-Type': 'application/json',
			...(options?.headers || {}),
		},
	});
};

const { get, post } = createAxiosInstance(cozeBase, {
	headers: {
		Authorization: `Bearer ${import.meta.env.VITE_COZE_API_KEY}`,
	},
});

/**
 * 查看空间下的已发布 Bot 列表
 * @param spaceId
 * @returns
 */
export const getBotList = () => {
	return get<CozeAPIResponse<{ space_bots: SimpleBot[]; total: number }>>(
		'/v1/space/published_bots_list',
		{
			space_id: import.meta.env.VITE_COZE_SPACE_ID,
		}
	);
};

/**
 * 创建会话
 * @param messages
 * @param meta_data
 * @returns
 */
export const createConversation = (
	messages?: EnterMessage[],
	meta_data?: MetaDataType
) => {
	return post<CozeAPIResponse<Conversation>>('/v1/conversation/create', {
		messages,
		meta_data,
	});
};

/**
 * 上传文件
 * @param file
 * @returns
 */
export const uploadFile = (file: File) => {
	const formData = new FormData();
	formData.append('file', file);
	return post<CozeAPIResponse<FileInfo>>('/v1/files/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

/**
 * 单次对话调用
 * PS：axios 基于 xhr 封装，不支持 readable stream，所以这里使用 fetch
 * @param input
 * @param fileList
 * @param options
 * @returns
 */
export const singleStreamChat = (
	input: string,
	fileList?: FileInfo[],
	options?: ChatReq
) => {
	const body = {
		bot_id: import.meta.env.VITE_COZE_GLOBAL_BOT,
		user_id: 'Jinli',
		additional_messages: convertInputToEnterMessage(input, fileList),
		auto_save_history: true,
		stream: true,
		...options,
	};
	return fetchHandler(cozeApiChat, {
		method: 'POST',
		body: JSON.stringify(body),
	});
};

export async function streamChat(
	input: string,
	fileList?: FileInfo[],
	options?: StreamChatReq
) {
	const stream = await client.chat.stream({
		bot_id: import.meta.env.VITE_COZE_GLOBAL_BOT,
		user_id: 'Jinli',
		additional_messages: convertInputToEnterMessage(input, fileList),
		auto_save_history: true,
		...options,
	});
	for await (const part of stream) {
		if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
			return part.data;
		}
	}
}
