import { ObjectStringItem } from '@coze/api';

/**
 * 当 role=assistant 时，用于标识 Bot 的消息类型，取值：
 * answer：Bot 最终返回给用户的消息内容。
 * function_call：Bot 对话过程中调用函数 (function call) 的中间结果。
 * tool_response：调用工具 (function call) 后返回的结果。
 * follow_up：如果 Bot 配置打开了用户问题建议开关，则返回配置的推荐问题。
 * verbose：详细返回
 */
// export enum BotMessageType {
// 	Answer = 'answer',
// 	FunctionCall = 'function_call',
// 	ToolResponse = 'tool_response',
// 	FollowUp = 'follow_up',
// 	Verbose = 'verbose',
// }

export type ObjectStringType = Pick<ObjectStringItem, 'type'>['type'];

// 多模态
export interface MultiModal extends FileInfo {
	url?: string;
}

export interface FileInfo {
	/**
	 * 已上传的文件 ID。
	 */
	id: string;
	/**
	 * 文件的总字节数。
	 */
	bytes: number;
	/**
	 * 文件的上传时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
	 */
	created_at: number;
	/**
	 * 文件名称。
	 */
	file_name: string;
	/**
	 * 文件类型。
	 */
	object_type: ObjectStringType;
}
