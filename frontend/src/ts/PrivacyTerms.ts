/**
 * 隐私条款数据类型与获取接口。
 * 前端由应用列表派生；后续可改为从 Native 或服务端拉取实际条款内容。
 */

import type { AppRiskLevel } from './AppList'
import { getAppList } from './AppList'

export interface PrivacyTermsItem {
	id: string
	appId: string
	appName: string
	appIcon?: string
	/** 条款摘要，列表行展示 */
	summary: string
	riskLevel?: AppRiskLevel
	/** 用于“按更新时间”排序；无数据时用占位 */
	updatedAt?: number
	/** 展开时展示的完整条款内容 */
	content: string
}

/** 从应用列表生成本地隐私条款列表（摘要与内容为占位，后续接入真实数据） */
export async function getPrivacyTermsList(): Promise<PrivacyTermsItem[]> {
	const apps = await getAppList()
	return apps.map((app) => ({
		id: `terms-${app.id}`,
		appId: app.id,
		appName: app.name,
		appIcon: app.icon,
		summary: `${app.name} 的隐私政策与用户协议`,
		riskLevel: app.riskLevel,
		updatedAt: Date.now() - Math.floor(Math.random() * 30) * 86400000,
		content: `此处为「${app.name}」的隐私条款与用户协议正文，由服务端或本地解析后注入。当前为占位内容。`,
	}))
}

export type PrivacyTermsSortOption = '按应用名称' | '按风险等级' | '按更新时间'

const RISK_ORDER: Record<AppRiskLevel | 'unknown', number> = {
	high: 0,
	medium: 1,
	normal: 2,
	unknown: 3,
}

export function sortPrivacyTerms(
	items: PrivacyTermsItem[],
	option: PrivacyTermsSortOption,
): PrivacyTermsItem[] {
	const list = [...items]
	switch (option) {
		case '按应用名称':
			return list.sort((a, b) => a.appName.localeCompare(b.appName, 'zh-CN'))
		case '按风险等级':
			return list.sort(
				(a, b) =>
					RISK_ORDER[a.riskLevel ?? 'unknown'] - RISK_ORDER[b.riskLevel ?? 'unknown'],
			)
		case '按更新时间':
			return list.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
		default:
			return list
	}
}
