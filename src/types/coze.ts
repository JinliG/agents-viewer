import { MultiModalType } from '.';

/**
 * 创建消息时的附加消息，获取消息时也会返回此附加消息。
 *
 * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
 */
export type MetaDataType = Record<string, string>;

/**
 * Bot 模式，取值：
 * - 0：单 Agent 模式
 * - 1：多 Agent 模式
 */
export type BotModeType = 0 | 1;

export type RoleType = 'user' | 'assistant';

/**
 * 对于 `text` 类型，`content` 除了是普通的文本之外，也可能也是一个 JSON 的字符串。
 *
 * 例如：
 * ```json
 * {
 *   "content_type": "text",
 *   "type": "tool_output",
 *   "content": "{\"news\": [{...}]}"
 * }
 * ```
 *
 * ---
 *
 * 对于 `object_string` 类型， `content` 是一个 JSON 的字符串的格式。
 *
 * 例如：
 * ```json
 * {
 *   "content_type": "object_string",
 *   "content": [
 *     {"type": "text", "text": "...."},
 *     {"type": "image": "file_id": "..."},
 *     {"type": "file": "file_url": "..."},
 *   ]
 * }
 * ```
 */
export type ContentType = 'text' | 'object_string' | 'card';

export type MessageType =
	| 'query'
	| 'answer'
	| 'function_call'
	| 'tool_output'
	| 'tool_response'
	| 'follow_up'
	| 'verbose';

export type ObjectStringItem =
	| { type: 'text'; text: string }
	| { type: MultiModalType; file_id: string }
	| { type: MultiModalType; file_url: string };

export interface CozeAPIResponse<T> {
	// 状态码 0 代表调用成功
	code: 0 | number;
	data: T;
	msg: string;
}

export interface ChatReq {
	/**
	 * 标识API背后的具体交互bot
	 */
	bot_id: string;
	/**
	 * 标识当前与 Bot 交互的用户，由使用方在业务系统中自行定义、生成与维护。
	 */
	user_id: string;
	/**
	 * 对话的附加信息。你可以通过此字段传入本次对话中用户的问题。数组长度限制为 100，即最多传入 100 条消息。
	 */
	additional_messages?: EnterMessage[];
	/**
	 * 是否启用流式返回。
	 */
	stream?: boolean;
	/**
	 * 是否自动保存历史对话记录：
	 */
	auto_save_history?: boolean;
	/**
	 * 创建消息时的附加消息，获取消息时也会返回此附加消息。
	 */
	meta_data?: Record<string, string>;
}

export interface BotInfo {
	/**
	 * Bot 的唯一标识。
	 */
	bot_id: string;

	/**
	 * Bot 的名称。
	 */
	name: string;

	/**
	 * Bot 的描述信息。
	 */
	description: string;

	/**
	 * Bot 的头像地址。
	 */
	icon_url: string;

	/**
	 * 创建时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
	 */
	create_time: number;

	/**
	 * 更新时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
	 */
	update_time: number;

	/**
	 * Bot 最新版本的版本号。
	 */
	version: string;

	/**
	 * Bot 的提示词配置，参考 Prompt object 说明。
	 */
	prompt_info: {
		/**
		 * Bot 配置的提示词。
		 */
		prompt: string;
	};

	/**
	 * Bot 的开场白配置，参考 Onboarding object 说明。
	 */
	onboarding_info: {
		/**
		 * Bot 配置的开场白内容。
		 */
		prologue: string;

		/**
		 * Bot 配置的推荐问题列表。未开启用户问题建议时，不返回此字段。
		 */
		suggested_questions?: string[];
	};

	/**
	 * Bot 模式，取值：
	 * - 0：单 Agent 模式
	 * - 1：多 Agent 模式
	 */
	bot_mode: BotModeType;

	/**
	 * Bot 配置的插件，参考 Plugin object 说明。
	 */
	plugin_info_list: BotPlugin[];

	/**
	 * Bot 配置的模型，参考 Model object 说明。
	 */
	model_info: {
		/**
		 * 模型的唯一标识。
		 */
		model_id: string;

		/**
		 * 模型名称。
		 */
		model_name: string;
	};
}

interface BotPlugin {
	/**
	 * 插件唯一标识。
	 */
	plugin_id: string;

	/**
	 * 插件名称。
	 */
	name: string;

	/**
	 * 插件描述。
	 */
	description: string;

	/**
	 * 插件头像。
	 */
	icon_url: string;

	/**
	 * 插件的工具列表信息
	 */
	api_info_list: {
		/**
		 * 工具的唯一标识。
		 */
		api_id: string;

		/**
		 * 工具的名称。
		 */
		name: string;

		/**
		 * 工具的描述。
		 */
		description: string;
	}[];
}

export interface SimpleBot {
	/**
	 * Bot 的唯一标识。
	 */
	bot_id: string;

	/**
	 * Bot 的名称。
	 */
	bot_name: string;

	/**
	 * Bot 的描述信息。
	 */
	description: string;

	/**
	 * Bot 的头像地址。
	 */
	icon_url: string;

	/**
	 * Bot 的最近一次发布时间，格式为 10 位的 Unixtime 时间戳。此 API 返回的 Bot 列表按照此字段降序排列。
	 */
	publish_time: string;
}

/**
 * https://www.coze.cn/docs/developer_guides/create_conversation#cde8cc95
 */
export interface EnterMessage {
	/**
	 * 发送这条消息的实体。取值：
	 * - user：代表该条消息内容是用户发送的。
	 * - assistant：代表该条消息内容是 Bot 发送的。
	 */
	role: RoleType;

	/**
	 * 消息类型。
	 * - query：用户输入内容。
	 * - answer：Bot 返回给用户的消息内容，支持增量返回。如果工作流绑定了 message 节点，可能会存在多 answer 场景，此时可以用流式返回的结束标志来判断所有 answer 完成。
	 * - function_call：Bot 对话过程中调用函数（function call）的中间结果。
	 * - tool_output：调用工具 （function call）后返回的结果。
	 * - tool_response：调用工具 （function call）后返回的结果。
	 * - follow_up：如果在 Bot 上配置打开了用户问题建议开关，则会返回推荐问题相关的回复内容。
	 * - verbose：多 answer 场景下，服务端会返回一个 verbose 包，对应的 content 为 JSON 格式，content.msg_type =generate_answer_finish 代表全部 answer 回复完成。
	 */
	type?: MessageType;

	/**
	 * 消息的内容，支持纯文本、多模态（文本、图片、文件混合输入）、卡片等多种类型的内容。
	 * - content_type 为 object_string 时，content 为 ObjectStringItem 的数组，详细说明可参考 Object_string object。
	 * - 当 content_type = text 时，content 格式为 Markdown。
	 */
	content?: string | ObjectStringItem[];

	/**
	 * 消息内容的类型，支持设置为：
	 * - text：文本。
	 * - object_string：多模态内容，即文本和文件的组合、文本和图片的组合。
	 * - card：卡片。
	 *
	 * 此枚举值仅在接口响应中出现，不支持作为入参。
	 *
	 * content 不为空时，此参数为必选。
	 */
	content_type?: ContentType;

	/**
	 * 创建消息时的附加消息，获取消息时也会返回此附加消息。
	 *
	 * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
	 */
	meta_data?: MetaDataType;
}

export interface Conversation {
	/**
	 * Conversation ID，即会话的唯一标识。
	 */
	id: string;

	/**
	 * 会话创建的时间。格式为 10 位的 Unixtime 时间戳，单位为秒。
	 */
	created_at: number;

	/**
	 * 创建消息时的附加消息，获取消息时也会返回此附加消息。
	 * 自定义键值对，应指定为 Map 对象格式。长度为 16 对键值对，其中键（key）的长度范围为 1～64 个字符，值（value）的长度范围为 1～512 个字符。
	 */
	meta_data: MetaDataType;
}

export interface ChatMessage {
	/**
	 * Message ID，即消息的唯一标识。
	 */
	id: string;

	/**
	 * 此消息所在的会话 ID。
	 */
	conversation_id: string;

	/**
	 * 编写此消息的 Bot ID。此参数仅在对话产生的消息中返回。
	 */
	bot_id: string;

	/**
	 * Chat ID。此参数仅在对话产生的消息中返回。
	 */
	chat_id: string;

	/**
	 * 创建消息时的附加消息，获取消息时也会返回此附加消息。
	 */
	meta_data: MetaDataType;

	/**
	 * 发送这条消息的实体。取值：
	 * - user：代表该条消息内容是用户发送的。
	 * - assistant：代表该条消息内容是 Bot 发送的。
	 */
	role: RoleType;

	/**
	 * 消息的内容，支持纯文本、多模态（文本、图片、文件混合输入）、卡片等多种类型的内容。
	 */
	content: string | ObjectStringItem[];

	/**
	 * 消息内容的类型，取值包括：
	 * - text：文本。
	 * - object_string：多模态内容，即文本和文件的组合、文本和图片的组合。
	 * - card：卡片。
	 *
	 * 此枚举值仅在接口响应中出现，不支持作为入参。
	 */
	content_type: ContentType;

	/**
	 * 消息的创建时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
	 */
	created_at: number;

	/**
	 * 消息的更新时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
	 */
	updated_at: number;

	/**
	 * 消息类型。
	 */
	type: MessageType;
}

export interface FileInfo extends File {
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
	object_type: MultiModalType;
}
