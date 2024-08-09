chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error));

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('--- bg on message request', request);
});
