import React, { useEffect, useMemo, useState } from 'react'
import { getAppList, sortAppList, type AppListItem, type AppListSortOption } from '../ts/AppList'

export interface AppListPageProps {
	showRiskBadge?: boolean
	sortBy?: AppListSortOption
	onSelectApp: (app: AppListItem) => void
}

export function AppListPage({
	showRiskBadge = true,
	sortBy = '按风险等级',
	onSelectApp,
}: AppListPageProps) {
	const [apps, setApps] = useState<AppListItem[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getAppList()
			.then(setApps)
			.finally(() => setLoading(false))
	}, [])

	const sortedApps = useMemo(() => sortAppList(apps, sortBy), [apps, sortBy])

	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<span className="header-title">应用列表</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="app-list-summary">
					<span className="app-list-count">共 {sortedApps.length} 个应用</span>
				</div>

				{loading ? (
					<div className="app-list-loading">
						<i className="ri-loader-4-line spin" aria-hidden />
						<span>加载中…</span>
					</div>
				) : (
					<ul className="app-list">
						{sortedApps.map((app) => (
							<li key={app.id}>
								<button
									type="button"
									className="app-list-row"
									onClick={() => onSelectApp(app)}
								>
									<div className="app-list-icon">
										{app.icon ? (
											<img src={app.icon} alt="" />
										) : (
											<i className="ri-apps-line" aria-hidden />
										)}
									</div>
									<div className="app-list-info">
										<span className="app-list-name">{app.name}</span>
										{(app.version != null || app.size != null) && (
											<span className="app-list-meta">
												{[app.version, app.size]
													.filter(Boolean)
													.join(' · ')}
											</span>
										)}
									</div>
									{showRiskBadge && app.riskLevel != null && (
										<div
											className={`risk-badge risk-${app.riskLevel}`}
											aria-label={`风险: ${app.riskLevel}`}
										>
											{app.riskLevel === 'high'
												? '高危'
												: app.riskLevel === 'medium'
													? '中危'
													: '常规'}
										</div>
									)}
									<i
										className="ri-arrow-right-s-line app-list-chevron"
										aria-hidden
									/>
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
