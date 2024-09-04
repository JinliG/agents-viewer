import { isEmpty } from 'lodash';
import { CrxMessagesMap, CrxSetting } from './types';

// chrome.storage.local：用于存储特定于浏览器窗口的数据。
// chrome.storage.sync：用于存储跨设备同步的数据。

const keys: (keyof CrxSetting)[] = ['translateMode', 'bubble'];

const defaultCrxSetting: CrxSetting = {
	translateMode: ['auto', 'zh-Hans'],
	bubble: true,
};

function getCrxSetting() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(keys, (result) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(isEmpty(result) ? defaultCrxSetting : result);
			}
		});
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log('--- sw receive message', request, sender.tab);
	switch (request.type) {
		case CrxMessagesMap.GET_CRX_SETTING:
			getCrxSetting().then((result) => {
				sendResponse(result);
			});
			break;
		case CrxMessagesMap.UPDATE_CRX_SETTING:
			const { setting } = request;
			chrome.storage.local.set(setting, () => {
				sendResponse({ success: true });
			});
			break;
		case CrxMessagesMap.OPEN_SIDE_PANEL:
			chrome.sidePanel
				.open({
					windowId: sender.tab.windowId,
				})
				.catch((err) => console.error(err))
				.finally(() => {
					sendResponse({ success: true });
				});
			break;
		case CrxMessagesMap.CLOSE_SIDE_PANEL:
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
});

console.log('--- sw loaded');
