import type { ChatMessage, EnterMessage } from '~/types/coze';

// 将用户输入转换为 EnterMessage
export function convertInputToEnterMessage(
	message: string,
	image?: any,
	file?: any
): EnterMessage[] {
	// 纯文本非多模态
	if (!image && !file) {
		return [
			{
				content: message,
				role: 'user',
				content_type: 'text',
			},
		];
	}

	// TODO: 上传文件or图片，获取 fileId or fileUrl，然后转为多模态上传
	return [];
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
