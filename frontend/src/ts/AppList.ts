/**
 * 应用列表数据类型与获取接口。
 * 前端用 mock；移动端后续通过 Native 获取手机内已安装应用列表注入。
 */

export type AppRiskLevel = 'high' | 'medium' | 'normal'

/** 单条权限：用于应用详情中的权限列表与底部统计 */
export interface AppPermissionItem {
	id: string
	name: string
	description: string
	riskLevel: AppRiskLevel
	icon: string
}

export interface AppListItem {
	id: string
	name: string
	packageName?: string
	/** 图标 URL 或 base64；移动端可为本地资源 */
	icon?: string
	riskLevel?: AppRiskLevel
	version?: string
	/** 体积等描述，如 "285 MB" */
	size?: string
	/** 安装时间戳，用于“按安装时间”排序；无则排到末尾 */
	installTime?: number
	/** 该应用申请的权限列表；无则使用默认列表 */
	permissions?: AppPermissionItem[]
}

/** 默认权限列表：当应用未提供 permissions 时使用 */
export const DEFAULT_APP_PERMISSIONS: AppPermissionItem[] = [
	{
		id: 'loc',
		name: '位置信息',
		description: '持续在后台访问精确位置。',
		riskLevel: 'high',
		icon: 'ri-map-pin-line',
	},
	{
		id: 'mic',
		name: '麦克风',
		description: '用于语音输入与语音消息。',
		riskLevel: 'medium',
		icon: 'ri-mic-line',
	},
	{
		id: 'storage',
		name: '存储与相册',
		description: '访问本地图片与文件。',
		riskLevel: 'normal',
		icon: 'ri-folder-open-line',
	},
]

/** 获取应用列表。Web 为 mock；移动端可替换为 Native 模块调用。 */
export function getAppList(): Promise<AppListItem[]> {
	return Promise.resolve(MOCK_APP_LIST)
}

export type AppListSortOption = '按风险等级' | '按名称' | '按安装时间' | '按大小'

const RISK_ORDER: Record<AppRiskLevel | 'unknown', number> = {
	high: 0,
	medium: 1,
	normal: 2,
	unknown: 3,
}

/** 将 "285 MB" 等解析为数字（MB）便于排序，解析失败返回 0 */
function parseSizeMb(sizeStr: string | undefined): number {
	if (!sizeStr) return 0
	const m = sizeStr.trim().match(/^([\d.]+)\s*MB$/i)
	return m ? Number(m[1]) || 0 : 0
}

export function sortAppList(
	items: AppListItem[],
	option: AppListSortOption,
): AppListItem[] {
	const list = [...items]
	switch (option) {
		case '按风险等级':
			return list.sort(
				(a, b) =>
					RISK_ORDER[a.riskLevel ?? 'unknown'] - RISK_ORDER[b.riskLevel ?? 'unknown'],
			)
		case '按名称':
			return list.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
		case '按安装时间':
			return list.sort((a, b) => (b.installTime ?? 0) - (a.installTime ?? 0))
		case '按大小':
			return list.sort(
				(a, b) => parseSizeMb(b.size) - parseSizeMb(a.size),
			)
		default:
			return list
	}
}

/** 前端 mock：模拟手机内应用列表 */
const MOCK_APP_LIST: AppListItem[] = [
	{
		id: '1',
		name: '微信',
		packageName: 'com.tencent.mm',
		riskLevel: 'high',
		version: '8.0.32',
		size: '285 MB',
	},
	{
		id: '2',
		name: '支付宝',
		packageName: 'com.eg.android.AlipayGphone',
		riskLevel: 'high',
		version: '10.5.0',
		size: '180 MB',
	},
	{
		id: '3',
		name: '抖音',
		packageName: 'com.ss.android.ugc.aweme',
		riskLevel: 'medium',
		version: '28.0.0',
		size: '320 MB',
	},
	{
		id: '4',
		name: '淘宝',
		packageName: 'com.taobao.taobao',
		riskLevel: 'medium',
		version: '10.22.0',
		size: '256 MB',
	},
	{
		id: '5',
		name: 'QQ',
		packageName: 'com.tencent.mobileqq',
		riskLevel: 'medium',
		version: '9.9.0',
		size: '198 MB',
	},
	{
		id: '6',
		name: '高德地图',
		packageName: 'com.autonavi.minimap',
		riskLevel: 'high',
		version: '13.00.0',
		size: '142 MB',
	},
	{
		id: '7',
		name: '网易云音乐',
		packageName: 'com.netease.cloudmusic',
		riskLevel: 'normal',
		version: '9.0.0',
		size: '88 MB',
	},
	{
		id: '8',
		name: '哔哩哔哩',
		packageName: 'tv.danmaku.bili',
		riskLevel: 'medium',
		version: '7.52.0',
		size: '165 MB',
	},
]
