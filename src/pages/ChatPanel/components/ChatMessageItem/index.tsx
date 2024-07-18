import MarkdownPreview from '@uiw/react-markdown-preview';
import type { Message } from 'ai/react';
import { Avatar } from 'antd';
import { forEach, isEmpty, map } from 'lodash';
import { useMemo } from 'react';

import { useAuthContext } from '~/context/AuthContextProvider';
import { useFeaturesContext } from '~/context/FeaturesContextProvider';
import { BotMessageRole } from '~/type';

import styles from './index.module.less';

/**
 * 支持的格式
 * 1. 纯文本
 * 2. json
 * 3. markdown
 */

interface ChatMessageProps {
	streamMessages: Message[];
	streaming: boolean;
}

interface BubbleProps {
	role: BotMessageRole;
	messages: Message[];
}

interface ChatMessageBubbleProps {
	bubble?: BubbleProps;
}

function BubbleHeader(bubble: BubbleProps) {
	const { role } = bubble;
	const { userInfo } = useAuthContext();
	const { currentFeature } = useFeaturesContext();

	const avatar = useMemo(() => {
		switch (role) {
			case BotMessageRole.Assistant:
				const { botAvatar } = currentFeature || {};
				return <Avatar src={botAvatar} style={{ width: 24, height: 24 }} />;
			case BotMessageRole.User:
				return <Avatar size={24} src={userInfo?.avatar} />;
			default:
				return null;
		}
	}, [role, currentFeature]);

	return <div className={styles.header}>{avatar}</div>;
}

function ChatMessageBubble(props: ChatMessageBubbleProps) {
	const { bubble } = props;
	const { messages } = bubble || {};

	return (
		<div className={styles.bubble}>
			<BubbleHeader {...bubble} />
			<MarkdownPreview
				className={styles.markdown}
				source={map(messages, (item) => item.content).join('')}
			/>
		</div>
	);
}

export default function ChatMessageItem(props: ChatMessageProps, ref) {
	const { streamMessages } = props;

	if (isEmpty(streamMessages)) {
		return null;
	}

	const bubbleList = useMemo<Array<BubbleProps>>(() => {
		const list = [];
		let assistantStreamMessages = [];
		forEach(streamMessages, (message, index) => {
			if (message.role === 'user') {
				if (isEmpty(assistantStreamMessages)) {
					list.push({
						role: BotMessageRole.User,
						messages: [message],
					});
				} else {
					list.push(
						{
							role: BotMessageRole.Assistant,
							messages: assistantStreamMessages,
						},
						{
							role: BotMessageRole.User,
							messages: [message],
						}
					);
					assistantStreamMessages = [];
				}
			} else {
				assistantStreamMessages.push(message);
			}

			// 最后一个消息
			if (
				index === streamMessages.length - 1 &&
				assistantStreamMessages.length > 0
			) {
				list.push({
					role: BotMessageRole.Assistant,
					messages: assistantStreamMessages,
				});
			}
		});

		return list;
	}, [streamMessages]);

	return (
		<div className='chat-message'>
			{map(bubbleList, (bubble, index) => {
				return <ChatMessageBubble key={index} bubble={bubble} />;
			})}
		</div>
	);
}
