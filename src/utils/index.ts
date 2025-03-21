import { EnterMessage, ObjectStringItem, RoleType } from '@coze/api';
import { isEmpty, map } from 'lodash';
import type { ChatMessage } from '~/types/coze';

// 将用户输入转换为多模态 EnterMessage
export function convertInputToEnterMessage(
	message: string,
	fileList?: any[]
): EnterMessage[] {
	// 纯文本消息
	if (isEmpty(fileList)) {
		return [
			{
				content: message,
				role: RoleType.User,
				content_type: 'text',
			},
		];
	}

	// 多模态消息
	const contents: ObjectStringItem[] = map(fileList, ({ object_type, id }) => {
		return {
			type: object_type,
			file_id: id,
		};
	});
	contents.push({
		type: 'text',
		text: message,
	});

	return [
		{
			content_type: 'object_string',
			content: JSON.stringify(contents),
			role: RoleType.User,
		},
	];
}

// 格式化多模态消息
export function formatAdditionalMessages(
	additionalMessages: EnterMessage[] | undefined
): EnterMessage[] {
	if (!Array.isArray(additionalMessages)) {
		return [];
	}

	return additionalMessages.map((item: EnterMessage): EnterMessage => {
		if (item.content_type === 'object_string' && Array.isArray(item.content)) {
			return {
				...item,
				content: JSON.stringify(item.content),
			};
		}
		return item;
	});
}

/**
 * 解析多条 json 拼接的 str
 * @param jsonStr
 * @returns jsonArr
 */
export function parseMultiJson(jsonStr: string): ChatMessage[] {
	const jsonArr = [];
	let startIndex = 0;
	let endIndex = 0;

	console.log('--- jsonStr', jsonStr);

	while (startIndex < jsonStr.length) {
		// 找到一个 JSON 对象的开始位置
		startIndex = jsonStr.indexOf('{', startIndex);
		if (startIndex === -1) {
			break;
		}

		// 找到一个 JSON 对象的结束位置
		let openBrackets = 1;
		endIndex = startIndex + 1;
		while (openBrackets > 0 && endIndex < jsonStr.length) {
			if (jsonStr[endIndex] === '{') {
				openBrackets++;
			} else if (jsonStr[endIndex] === '}') {
				openBrackets--;
			}
			endIndex++;
		}

		// 将该 JSON 对象解析为一个对象，并添加到数组中
		const json = jsonStr.substring(startIndex, endIndex);
		console.log('--- json', json);
		jsonArr.push(JSON.parse(json));

		// 更新下一个 JSON 对象的开始位置
		startIndex = endIndex;
	}

	return jsonArr;
}

// 判断是否在 chrome 扩展中运行
export function isChromeExtension(): boolean {
	// 尝试获取 manifest
	try {
		window.chrome.runtime.getManifest();
		return true;
	} catch (error) {
		return false;
	}
}

// 格式化字节数
export function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

export function generateUniqueKey(name: string): string {
	const hash = hashString(name);
	return `hash_${hash}`;
}
