import { Avatar } from 'antd';
import { forEach, groupBy, isEmpty, map } from 'lodash';
import { useMemo, useState } from 'react';

import { useAuthContext } from '~/context/AuthContextProvider';
import { useAgentsContext } from '~/context/AgentsContextProvider';
import { BotMessage, BotMessageRole } from '~/types';
import Markdown from 'react-markdown';

import styles from './index.module.less';
import remarkGfm from 'remark-gfm';
import LoadingDots from '~/components/LoadingDots';
import { FileCard } from '../..';

/**
 * 支持的格式
 * 1. 纯文本
 * 2. markdown
 */

interface BubbleProps {
	id: string;
	role: BotMessageRole;
	messages: BotMessage[];
}
interface ChatMessageBubbleProps {
	bubble?: BubbleProps;
}
function BubbleHeader(bubble: BubbleProps) {
	const { role } = bubble;
	const { userInfo } = useAuthContext();
	const { current: currentFeature } = useAgentsContext();
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

// 自定义 Img 组件
const CustomImg = ({ src, alt, ...props }) => {
	const [isZoomed, setIsZoomed] = useState(false);
	const { isChromeExtension } = useAuthContext();

	const handleZoom = () => {
		if (isChromeExtension) {
			window.open(src);
		} else {
			setIsZoomed(!isZoomed);
		}
	};

	return (
		<>
			<img
				className={styles.img}
				src={src}
				alt={alt}
				onClick={handleZoom}
				{...props}
			/>
			{isZoomed && (
				<div className={styles.zoomOverlay}>
					<img src={src} alt={alt} />
					<button onClick={() => setIsZoomed(false)}>Close</button>
				</div>
			)}
		</>
	);
};

function ChatMessageBubble(props: ChatMessageBubbleProps) {
	const { bubble } = props;
	const { role } = bubble || {};
	let messages = bubble.messages;

	let multiModalMessages = [];

	if (role === BotMessageRole.User) {
		const { true: multiModalMsgs, false: textMsgs } = groupBy(
			messages,
			(item) => !isEmpty(item.multiModal)
		);

		messages = textMsgs;
		multiModalMessages = multiModalMsgs;
	}

	return (
		<div className={styles.bubble}>
			<BubbleHeader {...bubble} />
			{!isEmpty(multiModalMessages) && (
				<div className={styles.multiModalArea}>
					{map(multiModalMessages, ({ multiModal }) => {
						return (
							<FileCard
								className={styles.multiModalCard}
								file={multiModal}
								allowRemove={false}
							/>
						);
					})}
				</div>
			)}
			<Markdown
				className={styles.markdown}
				remarkPlugins={[remarkGfm]}
				components={{
					img: CustomImg,
				}}
			>
				{map(messages, (item) => item.content).join('')}
			</Markdown>
		</div>
	);
}

interface ChatMessageProps {
	streamMessages: BotMessage[];
	isWaitingAnswer: boolean;
}

export default function ChatMessages(props: ChatMessageProps) {
	const { streamMessages, isWaitingAnswer } = props;

	const bubbleList = useMemo<Array<BubbleProps>>(() => {
		const list: Array<BubbleProps> = [];
		let currentBubble: BubbleProps | null = null;
		// 遍历流式消息，依据角色分别合并到消息气泡中
		forEach(streamMessages, (message, index) => {
			// 无 bubble 或角色&消息序列变化时，初始化 bubble
			if (
				!currentBubble ||
				currentBubble.role !== message.role ||
				currentBubble.id !== message.id
			) {
				// 收集 bubble
				if (currentBubble) {
					/**
					 * 由于 coze /v3/chat 在最后一个 event 中追加了一个包含完整响应内容的消息
					 * 所以这里必须手动移除
					 */
					if (currentBubble.role === BotMessageRole.Assistant) {
						currentBubble.messages.pop();
					}
					list.push(currentBubble);
				}

				currentBubble = {
					id: message.id,
					role: message.role,
					messages: [message],
				};
			} else if (currentBubble.role === message.role) {
				currentBubble.messages.push(message);
			}

			// 响应的最后一个消息
			if (index === streamMessages.length - 1) {
				if (currentBubble.role === BotMessageRole.Assistant) {
					currentBubble.messages.pop();
				}

				list.push(currentBubble);
			}
		});

		return list;
	}, [streamMessages]);

	if (isEmpty(streamMessages)) {
		return null;
	}

	return (
		<div className='chat-message'>
			{map(bubbleList, (bubble) => {
				return <ChatMessageBubble key={bubble.id} bubble={bubble} />;
			})}
			{isWaitingAnswer && <LoadingDots />}
		</div>
	);
}
