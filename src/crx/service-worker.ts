import { isEmpty } from 'lodash';
import {
	CrxMessageRequest,
	CrxMessageTypesMap,
	DefaultSectionKitMap,
	GlobalOptions,
} from './types';

const globalOptionKeys: (keyof GlobalOptions)[] = [
	'botStore',
	'common',
	'floatKit',
	'sectionKit',
	'user',
];

// 初始化
const defaultGlobalOptions: GlobalOptions = {
	botStore: {},
	common: {},
	floatKit: {
		visible: true,
	},
	sectionKit: {
		triggerMode: 'auto',
		writeHelper: true,
		kitFeatures: [
			{
				key: DefaultSectionKitMap.TRANSLATE,
				label: '翻译',
				prompt: '',
				isDefault: true,
			},
			{
				key: DefaultSectionKitMap.EXPLAIN,
				label: '解释',
				prompt: '',
				isDefault: true,
			},
			{
				key: DefaultSectionKitMap.READ,
				label: '朗读',
				prompt: '',
				isDefault: true,
			},
			{
				key: DefaultSectionKitMap.CONTINUE,
				label: '续写',
				prompt: '',
				isDefault: true,
				isWritingOnly: true,
			},
			{
				key: DefaultSectionKitMap.OPTIMIZE,
				label: '优化',
				prompt: '',
				isDefault: true,
				isWritingOnly: true,
			},
		],
	},
	user: {},
};
setGlobalOptions(defaultGlobalOptions);

function getGlobalOptions(keys: (keyof GlobalOptions)[] = globalOptionKeys) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(keys, (result) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(isEmpty(result) ? {} : result);
			}
		});
	});
}
function setGlobalOptions(options: GlobalOptions) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set(options, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(true);
			}
		});
	});
}

chrome.runtime.onMessage.addListener(
	(request: CrxMessageRequest, sender, sendResponse) => {
		console.log('--- sw receive message', request, sender.tab);
		const { type, payload = {} } = request;
		switch (type) {
			case CrxMessageTypesMap.GET_GLOBAL_OPTIONS:
				const { keys } = payload;
				getGlobalOptions(keys).then((result) => {
					sendResponse(result);
				});
				break;
			case CrxMessageTypesMap.UPDATE_GLOBAL_OPTIONS:
				if (payload) {
					setGlobalOptions(payload).then(() => {
						sendResponse({ success: true });
					});
				}
				break;
			case CrxMessageTypesMap.OPEN_SIDE_PANEL:
				chrome.sidePanel
					.open({
						windowId: sender.tab.windowId,
					})
					.catch((err) => console.error(err))
					.finally(() => {
						sendResponse({ success: true });
					});
				break;
			case CrxMessageTypesMap.CLOSE_SIDE_PANEL:
				chrome.sidePanel
					.setOptions({
						enabled: false,
					})
					.finally(() => {
						sendResponse({ success: true });
					});
				break;
			default:
				break;
		}

		// 异步任务
		return true;
	}
);

chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

console.log('--- sw loaded');
