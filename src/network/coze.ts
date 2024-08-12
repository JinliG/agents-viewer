import { createAxiosInstance } from '~/network/instance';
import type {
	Conversation,
	CozeAPIResponse,
	EnterMessage,
	FileInfo,
	MetaDataType,
	SimpleBot,
} from '~/types/coze';

export const cozeBase = 'https://api.coze.cn';
export const cozeHost = 'api.coze.cn';
export const cozeApiChat = '/v3/chat';

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
