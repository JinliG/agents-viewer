import { forEach, isEqual, map, some, split } from 'lodash';
import xpath from 'xpath';

export interface TextNode {
	xpath: string;
	text: string;
	element: HTMLElement;
	node: Node;
	siblingParentBlock: HTMLElement;
	transText?: string;
}

const ignoreNodes = ['head', 'script', 'style', 'noscript', 'code'];

// 定义一个函数来获取所有文本节点及其 XPath 路径
export function getTextNodesWithXPath(doc: Node): TextNode[] {
	const results = [];
	// 使用 XPath 查询所有文本节点
	const textNodes = (xpath.select('//text()', doc) || []) as Node[];

	let siblingParentPath: string = null;
	let siblingParentBlock: HTMLElement = null;
	let blockItems: TextNode[] = [];
	// 遍历所有文本节点并提取其文本内容和 XPath 路径，同时标记同一文字块
	forEach(textNodes, (node) => {
		const textContent = node.textContent.trim();
		if (textContent !== '') {
			const path = xpathLocationPath(node);
			const pathTags = split(path, '/');
			const siblingParentTags = split(siblingParentPath, '/');
			if (some(ignoreNodes, (item) => pathTags.includes(item))) {
				return;
			}

			const textParentElement = node.parentElement;

			// 缓存文字块内容，在明确 siblingParentBlock 后，再 push
			const cacheBlockNodes = () => {
				blockItems.push({
					xpath: path,
					text: textContent,
					element: node.parentElement,
					node,
					siblingParentBlock,
				});
			};
			// 存储一个文字块结果
			const pushResults = () => {
				results.push(
					...map(blockItems, (item) => ({
						...item,
						siblingParentBlock,
					}))
				);
				blockItems = [];
			};

			// 初始化
			if (!siblingParentPath && !siblingParentBlock) {
				siblingParentPath = path;
				siblingParentBlock = textParentElement;

				cacheBlockNodes();
				return;
			}

			// 当前 path 为当前文字块新的 siblingParentPath
			if (siblingParentPath && siblingParentPath.includes(path)) {
				siblingParentPath = path;
				siblingParentBlock = textParentElement;

				cacheBlockNodes();
				return;
			}

			// path 从属当前 siblingParentPath，不需要改变
			if (
				siblingParentPath &&
				path.includes(siblingParentPath) &&
				isEqual(pathTags.slice(0, siblingParentPath.length), siblingParentTags)
			) {
				cacheBlockNodes();
				return;
			}

			// 当前 path 属于一个新的文字块
			if (siblingParentPath && siblingParentBlock !== node.parentElement) {
				pushResults();

				siblingParentPath = path;
				siblingParentBlock = textParentElement;
				cacheBlockNodes();
			}
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

// 是否是块级元素
export function isBlockLevelElement(element: HTMLElement): boolean {
	const style = window.getComputedStyle(element);
	const display = style.display;
	const tagName = element.tagName.toLowerCase();

	// 常见的块级元素
	const commonBlockElements = [
		'address',
		'article',
		'aside',
		'blockquote',
		'canvas',
		'dd',
		'details',
		'dialog',
		'dl',
		'dt',
		'fieldset',
		'figcaption',
		'figure',
		'footer',
		'form',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'header',
		'hgroup',
		'hr',
		'main',
		'nav',
		'noscript',
		'ol',
		'output',
		'p',
		'pre',
		'section',
		'table',
		'ul',
		'video',
	];

	// 特殊的块级元素
	const specialBlockElements = [
		'li',
		'table',
		'thead',
		'tbody',
		'tfoot',
		'tr',
		'td',
		'th',
	];

	// CSS 属性
	const blockDisplays = ['block', 'table', 'flex', 'grid', 'inline-block'];

	// 检查是否为常见的块级元素
	if (commonBlockElements.includes(tagName)) {
		return true;
	}

	// 检查是否为特殊的块级元素
	if (specialBlockElements.includes(tagName)) {
		return true;
	}

	// 检查 display 属性
	for (const displayType of blockDisplays) {
		if (display.startsWith(displayType)) {
			return true;
		}
	}

	return false;
}
