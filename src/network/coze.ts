import { createAxiosInstance } from '~/network/instance';
import {
	CozeAPI,
	EnterMessage,
	Conversation,
	MetaDataType,
	BotInfo,
} from '@coze/api';
import { FileInfo } from '~/types';

export const cozeBase = 'https://api.coze.cn';
export const cozeHost = 'api.coze.cn';
export const cozeApiChat = '/v3/chat';

export const client = new CozeAPI({
	token: import.meta.env.VITE_COZE_API_KEY,
	baseURL: cozeBase,
	allowPersonalAccessTokenInBrowser: true,
});

export interface CozeAPIResponse<T> {
	// 状态码 0 代表调用成功
	code: 0 | number;
	data: T;
	msg: string;
}

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
	return get<CozeAPIResponse<{ space_bots: BotInfo[]; total: number }>>(
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
