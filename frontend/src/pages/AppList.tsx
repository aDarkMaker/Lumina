import React, { useEffect, useState } from 'react'
import { getAppList, type AppListItem } from '../ts/AppList'

interface AppListPageProps {
	onSelectApp: (app: AppListItem) => void
}

export function AppListPage({ onSelectApp }: AppListPageProps) {
	const [apps, setApps] = useState<AppListItem[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getAppList()
			.then(setApps)
			.finally(() => setLoading(false))
	}, [])

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
					<span className="app-list-count">共 {apps.length} 个应用</span>
				</div>

				{loading ? (
					<div className="app-list-loading">
						<i className="ri-loader-4-line spin" aria-hidden />
						<span>加载中…</span>
					</div>
				) : (
					<ul className="app-list">
						{apps.map((app) => (
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
									{app.riskLevel != null && (
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

			<div className="bottom-nav">
				<button type="button" className="nav-item">
					<i className="ri-home-4-line nav-icon" aria-hidden />
					<span className="nav-label">总览</span>
				</button>
				<button type="button" className="nav-item active">
					<i className="ri-apps-line nav-icon" aria-hidden />
					<span className="nav-label">应用</span>
				</button>
				<button type="button" className="nav-item">
					<i className="ri-shield-keyhole-line nav-icon" aria-hidden />
					<span className="nav-label">隐私</span>
				</button>
				<button type="button" className="nav-item">
					<i className="ri-notification-3-line nav-icon" aria-hidden />
					<span className="nav-label">提醒</span>
				</button>
				<button type="button" className="nav-item">
					<i className="ri-settings-4-line nav-icon" aria-hidden />
					<span className="nav-label">设置</span>
				</button>
			</div>
		</div>
	)
}
