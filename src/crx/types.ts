export interface CrxSetting {
	translateMode: [string, string];
	bubble: boolean;
}

// 悬浮工具
export interface FloatKitOptions {
	[key: string]: any;
	// 是否显示
	visible: boolean;
}

// 默认快捷工具
export enum DefaultSectionKitMap {
	// 翻译
	TRANSLATE = '$default_translate',
	// 解释
	EXPLAIN = '$default_explain',
	// 朗读
	READ = '$default_read',
	// 续写
	CONTINUE = '$default_continue',
	// 优化
	OPTIMIZE = '$default_optimize',
	// 校对
	CORRECT = '$default_correct',
}

// 快捷工具功能
export interface KitFeature {
	// 唯一标识
	key: string | DefaultSectionKitMap;
	// 标题
	label: string;
	// 提示词
	prompt: string;
	// 是否是默认工具
	isDefault: boolean;
	// 描述
	description?: string;
	// 只有在写作模式下可用
	isWritingOnly?: boolean;
	// 是否折叠
	isCollapsed?: boolean;
}

// 快捷工具
export interface SectionKitOptions {
	[key: string]: any;
	// 触发模式
	triggerMode: 'auto' | 'manual';
	// 写作助手
	writeHelper: boolean;
	// 快捷工具组
	kitFeatures: KitFeature[];
}

// 全局配置
export interface GlobalOptions {
	// 用户信息
	user: any;
	// 通用配置
	common: any;
	// 悬浮工具
	floatKit: FloatKitOptions;
	// 快捷工具
	sectionKit: SectionKitOptions;
	// 机器人市场
	botStore: any;
}

export enum CrxSourceMap {
	CONTENT_SCRIPT = 'content_script',
	INJECT = 'inject',
	POPUP = 'popup',
	SIDER = 'sidePanel',
	OPTIONS = 'options',
}

export enum CrxMessageTypesMap {
	// 获取全局配置
	GET_GLOBAL_OPTIONS = 'GET_GLOBAL_OPTIONS',
	// 更新全局配置
	UPDATE_GLOBAL_OPTIONS = 'UPDATE_GLOBAL_OPTIONS',
	// 打开侧边栏
	OPEN_SIDE_PANEL = 'OPEN_SIDE_PANEL',
	// 关闭侧边栏
	CLOSE_SIDE_PANEL = 'CLOSE_SIDE_PANEL',
}

export interface CrxMessageRequest {
	[key: string]: any;
	type: CrxMessageTypesMap;
	source: CrxSourceMap;
	payload?: any;
}
