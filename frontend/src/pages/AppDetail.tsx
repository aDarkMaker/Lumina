import React, { useState, useMemo, useEffect } from 'react'
import type { AppListItem, AppPermissionItem } from '../ts/AppList'
import { DEFAULT_APP_PERMISSIONS, fetchAppPermissions, mergePermissionsByShortName } from '../ts/AppList'
import { Switch } from '../components/Switch'

interface AppDetailProps {
	app: AppListItem | null
	onBack: () => void
}

export function AppDetail({ app, onBack }: AppDetailProps) {
	const [realPermissions, setRealPermissions] = useState<AppPermissionItem[] | null>(null)
	const [permissionsLoading, setPermissionsLoading] = useState(false)
	const permissions =
		realPermissions != null && realPermissions.length > 0
			? realPermissions
			: app?.permissions ?? DEFAULT_APP_PERMISSIONS
	const [showUninstallConfirm, setShowUninstallConfirm] = useState(false)

	useEffect(() => {
		if (!app?.packageName) {
			setRealPermissions(null)
			return
		}
		let cancelled = false
		setPermissionsLoading(true)
		fetchAppPermissions(app.packageName).then((list) => {
			if (!cancelled) {
				setRealPermissions(list.length > 0 ? list : null)
				setPermissionsLoading(false)
			}
		})
		return () => {
			cancelled = true
		}
	}, [app?.packageName])

	const { total, riskCount, normalCount, riskPermissions } = useMemo(() => {
		const total = permissions.length
		const risk = permissions.filter(
			(p) => p.riskLevel === 'high' || p.riskLevel === 'medium',
		)
		const normalCount = permissions.filter((p) => p.riskLevel === 'normal').length
		const merged = mergePermissionsByShortName(risk)
		return {
			total,
			riskCount: merged.length,
			normalCount,
			riskPermissions: merged,
		}
	}, [permissions])

	const displayName = app?.name ?? '烛照'
	const displayVersion = app?.version
		? `Version ${app.version}${app.size != null ? ` · ${app.size}` : ''}`
		: 'Permission & Privacy Inspector'

	async function handleOpen() {
		if (!app?.packageName) return
		try {
			const { Capacitor } = await import('@capacitor/core')
			if (Capacitor.isNativePlatform()) {
				const { AppScanner } = await import('@lumina/mobile')
				await AppScanner.launchApp({ packageName: app.packageName })
			}
		} catch (e) {
			console.warn('[Lumina] launchApp failed', e)
		}
	}

	function handleUninstallClick() {
		if (!app?.packageName) return
		setShowUninstallConfirm(true)
	}

	async function handleUninstallConfirm() {
		if (!app?.packageName) return
		try {
			const { Capacitor } = await import('@capacitor/core')
			if (Capacitor.isNativePlatform()) {
				const { AppScanner } = await import('@lumina/mobile')
				await AppScanner.openUninstallScreen({ packageName: app.packageName })
			}
		} catch (e) {
			console.warn('[Lumina] openUninstallScreen failed', e)
		}
		setShowUninstallConfirm(false)
	}

	function handleUninstallCancel() {
		setShowUninstallConfirm(false)
	}

	async function handleOpenAppInfo() {
		if (!app?.packageName) return
		try {
			const { Capacitor } = await import('@capacitor/core')
			if (Capacitor.isNativePlatform()) {
				const { AppScanner } = await import('@lumina/mobile')
				await AppScanner.openAppInfo({ packageName: app.packageName })
			}
		} catch (e) {
			console.warn('[Lumina] openAppInfo failed', e)
		}
	}

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
					<div
						className={`app-icon-wrapper ${app?.icon ? '' : 'app-icon-wrapper--placeholder'}`}
					>
						{app?.icon ? (
							<img src={app.icon} alt="" className="app-icon-img" />
						) : (
							<i className="ri-shield-keyhole-fill app-icon-ri" aria-hidden />
						)}
					</div>
					<h1 className="app-name">{displayName}</h1>
					<p className="app-version">{displayVersion}</p>

					<div className="action-buttons">
						<button
							type="button"
							className="btn btn-primary"
							onClick={handleOpen}
							disabled={!app?.packageName}
						>
							打开
						</button>
						<button
							type="button"
							className="btn btn-outline"
							onClick={handleUninstallClick}
							disabled={!app?.packageName}
						>
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
					{app?.packageName && (
						<button
							type="button"
							className="section-title-action"
							onClick={handleOpenAppInfo}
						>
							在系统设置中查看
						</button>
					)}
				</div>

				{permissionsLoading && permissions.length === 0 ? (
					<p className="permissions-loading">正在加载权限…</p>
				) : (
					<>
						{riskPermissions.map((perm) => (
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
								</div>
								<Switch
									checked={perm.grantState === 'granted'}
									onChange={handleOpenAppInfo}
									aria-label={`${perm.name}权限，点击前往系统设置`}
								/>
							</div>
						))}
						{normalCount > 0 && (
							<p className="perm-normal-summary">另有 {normalCount} 项常规权限</p>
						)}
					</>
				)}
			</div>

			{showUninstallConfirm && app?.packageName && (
				<div
					className="confirm-overlay"
					onClick={handleUninstallCancel}
					role="dialog"
					aria-modal="true"
					aria-labelledby="confirm-uninstall-title"
					aria-describedby="confirm-uninstall-message"
				>
					<div
						className="confirm-card"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 id="confirm-uninstall-title" className="confirm-title">
							确认卸载
						</h2>
						<p id="confirm-uninstall-message" className="confirm-message">
							确定要卸载「{displayName}」吗？<br />
							卸载后将跳转到系统卸载页面。
						</p>
						<div className="confirm-actions">
							<button
								type="button"
								className="confirm-btn confirm-btn-cancel"
								onClick={handleUninstallCancel}
							>
								取消
							</button>
							<button
								type="button"
								className="confirm-btn confirm-btn-danger"
								onClick={handleUninstallConfirm}
							>
								确认卸载
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
