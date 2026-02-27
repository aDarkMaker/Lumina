import { useState, useMemo } from 'react'
import type { AppListItem } from '../ts/AppList'
import { DEFAULT_APP_PERMISSIONS } from '../ts/AppList'
import { Switch } from '../components/Switch'

interface AppDetailProps {
	app: AppListItem | null
	onBack: () => void
}

export function AppDetail({ app, onBack }: AppDetailProps) {
	const permissions = app?.permissions ?? DEFAULT_APP_PERMISSIONS
	const [checkedById, setCheckedById] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(permissions.map((p) => [p.id, true])),
	)

	const { total, riskCount, normalCount } = useMemo(() => {
		const total = permissions.length
		const riskCount = permissions.filter(
			(p) => p.riskLevel === 'high' || p.riskLevel === 'medium',
		).length
		const normalCount = permissions.filter((p) => p.riskLevel === 'normal').length
		return { total, riskCount, normalCount }
	}, [permissions])

	const displayName = app?.name ?? '烛照'
	const displayVersion = app?.version
		? `Version ${app.version}${app.size != null ? ` · ${app.size}` : ''}`
		: 'Permission & Privacy Inspector'

	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<button type="button" className="back-btn" onClick={onBack} aria-label="返回">
						<i className="ri-arrow-left-line" aria-hidden />
					</button>
					<span className="header-title">应用详情</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="app-info">
					<div className="app-icon-wrapper">
						{app?.icon ? (
							<img src={app.icon} alt="" className="app-icon-img" />
						) : (
							<i className="ri-shield-keyhole-fill app-icon-ri" aria-hidden />
						)}
					</div>
					<h1 className="app-name">{displayName}</h1>
					<p className="app-version">{displayVersion}</p>

					<div className="action-buttons">
						<button type="button" className="btn btn-primary">
							打开
						</button>
						<button type="button" className="btn btn-outline">
							卸载
						</button>
					</div>
				</div>

				<div className="stats-container">
					<div className="stat-card">
						<span className="stat-value text-white">{total}</span>
						<span className="stat-label">申请权限</span>
					</div>
					<div className="stat-card">
						<span className="stat-value text-red">{riskCount}</span>
						<span className="stat-label">风险权限</span>
					</div>
					<div className="stat-card">
						<span className="stat-value text-green">{normalCount}</span>
						<span className="stat-label">常规权限</span>
					</div>
				</div>

				<div className="section-title">
					<span>权限</span>
					<span>管理全部</span>
				</div>

				{permissions.map((perm) => (
					<div key={perm.id} className="permission-item">
						<div className="perm-icon">
							<i className={perm.icon} aria-hidden />
						</div>
						<div className="perm-content">
							<div className="perm-header">
								<span className="perm-name">{perm.name}</span>
								<div className={`risk-badge risk-${perm.riskLevel}`}>
									{perm.riskLevel === 'high'
										? '高危'
										: perm.riskLevel === 'medium'
											? '中危'
											: '常规'}
								</div>
							</div>
							<p className="perm-desc">{perm.description}</p>
						</div>
						<Switch
							checked={checkedById[perm.id] ?? true}
							onChange={(v) => setCheckedById((prev) => ({ ...prev, [perm.id]: v }))}
							aria-label={`${perm.name}权限`}
						/>
					</div>
				))}
			</div>

			<div className="bottom-nav">
				<button type="button" className="nav-item">
					<i className="ri-home-4-line nav-icon" aria-hidden />
					<span className="nav-label">总览</span>
				</button>
				<button type="button" className="nav-item">
					<i className="ri-apps-line nav-icon" aria-hidden />
					<span className="nav-label">应用</span>
				</button>
				<button type="button" className="nav-item active">
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
