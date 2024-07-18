import type { Message } from 'ai/react';
import { Avatar } from 'antd';
import { forEach, isEmpty, map } from 'lodash';
import { useMemo } from 'react';

import { useAuthContext } from '~/context/AuthContextProvider';
import { useFeaturesContext } from '~/context/FeaturesContextProvider';
import { BotMessageRole } from '~/types';
import Markdown from 'react-markdown';

import styles from './index.module.less';
import remarkGfm from 'remark-gfm';
import LoadingDots from '~/components/LoadingDots';

/**
 * 支持的格式
 * 1. 纯文本
 * 2. json
 * 3. markdown
 */

interface ChatMessageProps {
	streamMessages: Message[];
	isWaitingAnswer: boolean;
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
	const { botAvatar } = currentFeature || {};

	const avatar = useMemo(() => {
		switch (role) {
			case BotMessageRole.Assistant:
				return <Avatar src={botAvatar} style={{ width: 24, height: 24 }} />;
			case BotMessageRole.User:
				return <Avatar size={24} src={userInfo?.avatar} />;
			default:
				return null;
		}
	}, [role]);

	return <div className={styles.header}>{avatar}</div>;
}

function ChatMessageBubble(props: ChatMessageBubbleProps) {
	const { bubble } = props;
	const { messages } = bubble || {};

	return (
		<div className={styles.bubble}>
			<BubbleHeader {...bubble} />
			<Markdown className={styles.markdown} remarkPlugins={[remarkGfm]}>
				{map(messages, (item) => item.content).join('')}
			</Markdown>
		</div>
	);
}

export default function ChatMessages(props: ChatMessageProps) {
	const { streamMessages, isWaitingAnswer } = props;

	if (isEmpty(streamMessages)) {
		return null;
	}

	console.log('--- isWaitingAnswer', isWaitingAnswer);

	const bubbleList = useMemo<Array<BubbleProps>>(() => {
		const list: Array<BubbleProps> = [];
		let assistantStreamMessages: Message[] = [];
		// 遍历流式消息，依据角色合并到消息气泡中
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
			{isWaitingAnswer && <LoadingDots />}
		</div>
	);
}
