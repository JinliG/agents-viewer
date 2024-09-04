export interface CrxSetting {
	translateMode: [string, string];
	bubble: boolean;
}

export enum CrxSourceMap {
	CONTENT_SCRIPT = 'content_script',
	INJECT = 'inject',
	POPUP = 'popup',
	SIDER = 'sidePanel',
}

export enum CrxMessagesMap {
	// 获取插件配置
	GET_CRX_SETTING = 'GET_CRX_SETTING',
	// 更新插件配置
	UPDATE_CRX_SETTING = 'UPDATE_CRX_SETTING',
	// 打开侧边栏
	OPEN_SIDE_PANEL = 'OPEN_SIDE_PANEL',
	// 关闭侧边栏
	CLOSE_SIDE_PANEL = 'CLOSE_SIDE_PANEL',
}
