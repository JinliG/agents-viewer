import { filter } from 'lodash';
import { useState } from 'react';
import { ChatMessage, MessageType } from '~/types/coze';
import { parseMultiJson } from '~/utils';

interface StreamHandlerResult<T> {
	processing: boolean;
	bufferMessages: ChatMessage[];
	error?: Error;
	handleStream: (stream: ReadableStream) => void;
}

export function useStreamHandler<T>(): StreamHandlerResult<T> {
	const [processing, setProcessing] = useState(false);
	const [bufferMessages, setBufferMessages] = useState<ChatMessage[]>([]);
	const [error, setError] = useState<Error>();

	// 流处理逻辑
	const handleStream = (stream: ReadableStream) => {
		setProcessing(true);
		const reader = stream?.getReader();

		const push = () =>
			reader
				?.read()
				.then(({ done, value }) => {
					console.log('--- done', done, value);
					if (done === true) {
						setProcessing(false);
						console.log('stream done', bufferMessages);
						return;
					}
					const chunk = new TextDecoder().decode(value);
					const list = parseMultiJson(chunk);
					console.log('--- list', list);
					setBufferMessages((prev) => [...prev, ...list]);
					push();
				})
				.catch((e) => {
					setError(e as Error);
					setProcessing(false);
				});

		console.log('--- reder', reader);
		push();
	};

	return {
		processing,
		bufferMessages,
		error,
		handleStream,
	};
}

export function filterChatMessages(
	events: ChatMessage[],
	types: MessageType[]
) {
	return filter(events, (item) => types.includes(item.type));
}
