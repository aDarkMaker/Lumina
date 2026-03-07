/**
 * 应用列表数据类型与获取接口。
 * 前端用 mock；移动端后续通过 Native 获取手机内已安装应用列表注入。
 */

export type AppRiskLevel = 'high' | 'medium' | 'normal'

/** 权限授予状态（仅原生获取到时存在） */
export type PermissionGrantState = 'granted' | 'denied' | 'unknown'

/** 单条权限：用于应用详情中的权限列表与底部统计 */
export interface AppPermissionItem {
	id: string
	name: string
	description: string
	riskLevel: AppRiskLevel
	icon: string
	/** 授予状态：已授予 / 已拒绝 / 未知（需在系统设置中查看） */
	grantState?: PermissionGrantState
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

/** 常见权限的短名称，避免列表冗长 */
function shortPermissionName(name: string, label: string): string {
	const n = name.toUpperCase()
	if (n.includes('ACCESS_FINE_LOCATION') || n.includes('ACCESS_COARSE_LOCATION')) return '位置'
	if (n.includes('CAMERA')) return '相机'
	if (n.includes('RECORD_AUDIO') || n.includes('MICROPHONE')) return '麦克风'
	if (n.includes('READ_EXTERNAL') || n.includes('WRITE_EXTERNAL') || n.includes('STORAGE') || n.includes('MANAGE_EXTERNAL')) return '存储'
	if (n.includes('READ_CONTACTS') || n.includes('WRITE_CONTACTS')) return '通讯录'
	if (n.includes('READ_CALENDAR') || n.includes('WRITE_CALENDAR')) return '日历'
	if (n.includes('READ_SMS') || n.includes('SEND_SMS') || n.includes('RECEIVE_SMS')) return '短信'
	if (n.includes('READ_PHONE_STATE') || n.includes('CALL_PHONE') || n.includes('READ_CALL_LOG') || n.includes('WRITE_CALL_LOG')) return '电话'
	if (n.includes('BODY_SENSORS') || n.includes('ACTIVITY_RECOGNITION')) return '传感器'
	if (n.includes('POST_NOTIFICATIONS')) return '通知'
	if (n.includes('BLUETOOTH') || n.includes('BLUETOOTH_CONNECT')) return '蓝牙'
	if (n.includes('NFC')) return 'NFC'
	if (n.includes('READ_MEDIA')) return '媒体'
	const short = (label || name).trim()
	if (short.length <= 8) return short
	return short.slice(0, 6) + '…'
}

/** 将原生权限列表转为 AppPermissionItem[]，含授予状态与风险等级；名称已缩短 */
function nativePermissionsToItems(
	native: { name: string; label: string; protectionLevel: string; granted?: boolean }[],
): AppPermissionItem[] {
	const riskFromLevel = (level: string): AppRiskLevel => {
		if (level === 'dangerous') return 'medium'
		if (level === 'normal' || level === 'signature') return 'normal'
		return 'normal'
	}
	const iconFromName = (name: string): string => {
		if (name.includes('LOCATION') || name.includes('location')) return 'ri-map-pin-line'
		if (name.includes('CAMERA')) return 'ri-camera-line'
		if (name.includes('RECORD_AUDIO') || name.includes('MICROPHONE')) return 'ri-mic-line'
		if (name.includes('READ_EXTERNAL') || name.includes('WRITE_EXTERNAL') || name.includes('STORAGE')) return 'ri-folder-open-line'
		if (name.includes('CONTACTS')) return 'ri-contacts-line'
		if (name.includes('SMS') || name.includes('PHONE')) return 'ri-phone-line'
		if (name.includes('CALENDAR')) return 'ri-calendar-line'
		return 'ri-shield-keyhole-line'
	}
	return native.map((p, i) => ({
		id: p.name || `perm-${i}`,
		name: shortPermissionName(p.name, p.label),
		description: p.name,
		riskLevel: riskFromLevel(p.protectionLevel),
		icon: iconFromName(p.name),
		grantState: p.granted === true ? 'granted' : p.granted === false ? 'denied' : 'unknown',
	}))
}

/** 获取指定应用的实际权限列表（含授予状态）。仅原生环境返回真实数据；否则返回空数组，由调用方使用默认列表。 */
export async function fetchAppPermissions(packageName: string): Promise<AppPermissionItem[]> {
	try {
		const { Capacitor } = await import('@capacitor/core')
		if (Capacitor.isNativePlatform()) {
			const { AppScanner } = await import('@lumina/mobile')
			const { permissions } = await AppScanner.getAppPermissions({ packageName })
			return nativePermissionsToItems(permissions)
		}
	} catch (e) {
		console.warn('[Lumina] getAppPermissions failed', e)
	}
	return []
}

export interface DeviceRiskSummary {
	totalRiskPermissionCount: number
	riskApps: { packageName: string; name: string; riskCount: number; icon?: string }[]
}

const DEVICE_RISK_CACHE_MS = 5 * 60 * 1000 // 5 分钟
let cachedDeviceRisk: { data: DeviceRiskSummary; timestamp: number } | null = null

/** 清除设备风险汇总缓存（如需要强制刷新时调用） */
export function invalidateDeviceRiskSummaryCache(): void {
	cachedDeviceRisk = null
}

/** 若存在未过期的缓存则返回，用于主页挂载时先展示缓存避免闪加载。 */
export function getCachedDeviceRiskSummary(): DeviceRiskSummary | null {
	if (cachedDeviceRisk == null) return null
	if (Date.now() - cachedDeviceRisk.timestamp >= DEVICE_RISK_CACHE_MS) return null
	return cachedDeviceRisk.data
}

/** 全机高风险权限统计（用于主页）。仅原生环境返回真实数据；结果会缓存，切页不重复请求。 */
export async function getDeviceRiskSummary(): Promise<DeviceRiskSummary> {
	const now = Date.now()
	if (cachedDeviceRisk != null && now - cachedDeviceRisk.timestamp < DEVICE_RISK_CACHE_MS) {
		return cachedDeviceRisk.data
	}
	try {
		const { Capacitor } = await import('@capacitor/core')
		if (Capacitor.isNativePlatform()) {
			const { AppScanner } = await import('@lumina/mobile')
			const res = await AppScanner.getDeviceRiskSummary()
			const data: DeviceRiskSummary = {
				totalRiskPermissionCount: res.totalRiskPermissionCount,
				riskApps: res.riskApps,
			}
			cachedDeviceRisk = { data, timestamp: now }
			return data
		}
	} catch (e) {
		console.warn('[Lumina] getDeviceRiskSummary failed', e)
	}
	const fallback = { totalRiskPermissionCount: 0, riskApps: [] }
	cachedDeviceRisk = { data: fallback, timestamp: now }
	return fallback
}

const MERGE_RISK_ORDER: Record<AppRiskLevel, number> = { high: 2, medium: 1, normal: 0 }

/** 按短名称合并权限：同名只保留一条，风险取最高；组内任一已授予则显示已授予。 */
export function mergePermissionsByShortName(items: AppPermissionItem[]): AppPermissionItem[] {
	const byName = new Map<string, AppPermissionItem[]>()
	for (const p of items) {
		const list = byName.get(p.name) ?? []
		list.push(p)
		byName.set(p.name, list)
	}
	return Array.from(byName.entries()).map(([name, group]) => {
		const first = group[0]!
		const riskLevel = group.reduce(
			(max, p) => (MERGE_RISK_ORDER[p.riskLevel] > MERGE_RISK_ORDER[max] ? p.riskLevel : max),
			first.riskLevel,
		) as AppRiskLevel
		const grantedCount = group.filter((p) => p.grantState === 'granted').length
		const deniedCount = group.filter((p) => p.grantState === 'denied').length
		const hasAnyGrantInfo = group.some((p) => p.grantState != null)
		let grantState: PermissionGrantState | undefined
		if (hasAnyGrantInfo) {
			grantState = grantedCount > 0 ? 'granted' : deniedCount === group.length ? 'denied' : 'unknown'
		} else {
			grantState = undefined
		}
		return {
			id: group.map((p) => p.id).join('|'),
			name,
			description: first.description,
			riskLevel,
			icon: first.icon,
			grantState,
		}
	})
}

/** 从原生插件返回的数据转为 AppListItem（风险等级等由前端规则后续计算） */
function nativeToAppListItem(n: {
	id: string
	packageName: string
	name: string
	version?: string
	installTime?: number
	icon?: string
}): AppListItem {
	return {
		id: n.id,
		name: n.name,
		packageName: n.packageName,
		version: n.version,
		installTime: n.installTime,
		icon: n.icon,
	}
}

/** 应用列表缓存，避免每次进入应用 Tab 都重新扫描 */
let cachedAppList: AppListItem[] | null = null

/** 清除应用列表缓存（如下拉刷新、安装/卸载后需重刷时调用） */
export function invalidateAppListCache(): void {
	cachedAppList = null
}

/** 获取应用列表。Web 为 mock；移动端通过 @lumina/mobile 插件扫描本机已安装应用。结果会缓存，再次进入应用界面不会重复请求。 */
export async function getAppList(): Promise<AppListItem[]> {
	if (cachedAppList != null) {
		return [...cachedAppList]
	}
	try {
		const { Capacitor } = await import('@capacitor/core')
		if (Capacitor.isNativePlatform()) {
			const { AppScanner } = await import('@lumina/mobile')
			const { apps } = await AppScanner.getInstalledApps()
			cachedAppList = apps.map(nativeToAppListItem)
			return [...cachedAppList]
		}
	} catch (e) {
		console.warn('[Lumina] AppScanner unavailable, using mock list', e)
	}
	cachedAppList = MOCK_APP_LIST.map((a) => ({ ...a }))
	return [...cachedAppList]
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

export function sortAppList(items: AppListItem[], option: AppListSortOption): AppListItem[] {
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
			return list.sort((a, b) => parseSizeMb(b.size) - parseSizeMb(a.size))
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
