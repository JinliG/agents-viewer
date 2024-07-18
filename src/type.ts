/**
 * 当 role=assistant 时，用于标识 Bot 的消息类型，取值：
 * answer：Bot 最终返回给用户的消息内容。
 * function_call：Bot 对话过程中调用函数 (function call) 的中间结果。
 * tool_response：调用工具 (function call) 后返回的结果。
 * follow_up：如果 Bot 配置打开了用户问题建议开关，则返回配置的推荐问题。
 * verbose：详细返回
 */

export enum BotMessageType {
  Answer = "answer",
  FunctionCall = "function_call",
  ToolResponse = "tool_response",
  FollowUp = "follow_up",
  Verbose = "verbose"
}

export enum BotMessageRole {
  Assistant = "assistant",
  User = "user"
}

export interface BotMessage {
  role: BotMessageRole;
  type: BotMessageType;
  content: string;
  content_type: string;
}

export interface BotMessageEvent {
  event: "message";
  message: BotMessage;
  is_finish: boolean;
  index: number;
  conversation_id: string;
  seq_id: number;
}
