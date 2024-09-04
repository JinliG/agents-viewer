import { forEach, some } from 'lodash';
import xpath from 'xpath';

interface TextNode {
	xpath: string;
	text: string;
	element: HTMLElement;
	transText?: string;
}

const ignoreNodes = ['head', 'script', 'style', 'noscript', 'code'];

// 定义一个函数来获取所有文本节点及其 XPath 路径
export function getTextNodesWithXPath(doc: Node): TextNode[] {
	const results = [];
	// 使用 XPath 查询所有文本节点
	const textNodes = xpath.select('//text()', doc) || [];

	// 遍历所有文本节点并提取其文本内容和 XPath 路径
	forEach(textNodes as Node[], (node) => {
		const textContent = node.textContent.trim();
		if (textContent !== '') {
			const path = xpathLocationPath(node);
			if (some(ignoreNodes, (item) => path.includes(item))) {
				return;
			}
			results.push({
				xpath: path,
				text: textContent,
				element: node.parentElement,
			});
		}
	});

	return results;
}

// 获取节点的 XPath 路径
function xpathLocationPath(node) {
	let path = '';
	while (node && node.nodeType !== Node.DOCUMENT_NODE) {
		if (node.nodeType === Node.ELEMENT_NODE) {
			let index = 1;
			let sibling = node.previousSibling;
			while (sibling) {
				if (
					sibling.nodeType === Node.ELEMENT_NODE &&
					sibling.tagName === node.tagName
				) {
					index++;
				}
				sibling = sibling.previousSibling;
			}
			path =
				'/' +
				node.tagName.toLowerCase() +
				(index > 1 ? '[' + index + ']' : '') +
				path;
		}
		node = node.parentNode;
	}
	return path;
}
