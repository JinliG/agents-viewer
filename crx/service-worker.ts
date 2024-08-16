import { CrxMessages } from './constant';
import { CrxSetting } from './types';

// chrome.storage.local：用于存储特定于浏览器窗口的数据。
// chrome.storage.sync：用于存储跨设备同步的数据。

const keys: (keyof CrxSetting)[] = ['translateMode', 'bubble'];

function getCrxSetting() {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(keys, (result) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(result);
			}
		});
	});
}

// chrome.sidePanel
// 	.setPanelBehavior({ openPanelOnActionClick: true })
// 	.catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.type) {
		case CrxMessages.GET_CRX_SETTING:
			getCrxSetting().then((result) => {
				sendResponse(result);
			});
			break;
		case CrxMessages.UPDATE_CRX_SETTING:
			const { setting } = request;
			chrome.storage.sync.set(setting, () => {
				sendResponse({ success: true });
			});
			break;
		default:
			break;
	}
});
