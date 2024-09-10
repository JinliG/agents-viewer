import { filter } from 'lodash';
import { useState } from 'react';
import { ChatMessage, MessageType } from '~/types/coze';
import { parseMultiJson } from '~/utils';

interface StreamHandlerResult<T> {
	processing: boolean;
	bufferMessages: ChatMessage[];
	chatMessages: ChatMessage[];
	error?: Error;
	handleStream: (stream: ReadableStream) => void;
}

export function useStreamHandler<T>(): StreamHandlerResult<T> {
	const [processing, setProcessing] = useState(false);
	const [bufferMessages, setBufferMessages] = useState<ChatMessage[]>([]);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [error, setError] = useState<Error>();

	// 流处理逻辑
	const handleStream = (stream: ReadableStream) => {
		setProcessing(true);
		setChatMessages([]);

		const reader = stream?.getReader();
		const push = () =>
			reader
				?.read()
				.then(({ done, value }) => {
					if (done === true) {
						setProcessing(false);
						console.log('stream done', chatMessages);
						return;
					}
					const chunk = new TextDecoder().decode(value);
					const list = parseMultiJson(chunk);

					setBufferMessages((prev) => [...prev, ...list]);
					setChatMessages((prev) => [...prev, ...list]);
					push();
				})
				.catch((e) => {
					setError(e as Error);
					setProcessing(false);
				});

		push();
	};

	return {
		processing,
		chatMessages,
		bufferMessages,
		error,
		handleStream,
	};
}

export function filterChatMessages(
	events: ChatMessage[],
	types: MessageType[]
) {
	// v3 chat 末尾会追加为完整的消息，这里移除
	return filter(events, (item) => types.includes(item.type)).slice(0, -1);
}
