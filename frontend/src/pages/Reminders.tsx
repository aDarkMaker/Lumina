import { useState } from 'react'

/** 单条提醒：后续从监控结果注入 */
export interface ReminderItem {
	id: string
	title: string
	desc?: string
	time?: string
	riskLevel?: 'high' | 'medium'
	icon?: string
	iconBg?: string
}

export function Reminders() {
	const [riskApps, setRiskApps] = useState<ReminderItem[]>([])
	const [riskPermissions, setRiskPermissions] = useState<ReminderItem[]>([])
	const [unreasonableTerms, setUnreasonableTerms] = useState<ReminderItem[]>([])

	const totalCount = riskApps.length + riskPermissions.length + unreasonableTerms.length

	function renderList(
		items: ReminderItem[],
		emptyLabel: string,
		itemIcon: string,
		itemIconBg: string,
	) {
		if (items.length === 0) {
			return (
				<div className="reminders-empty">
					<i className="ri-checkbox-blank-line" aria-hidden />
					<span>{emptyLabel}</span>
				</div>
			)
		}
		return (
			<ul className="reminders-list">
				{items.map((item) => (
					<li key={item.id}>
						<button
							type="button"
							className={`reminders-item ${item.riskLevel === 'high' ? 'risk-high' : 'risk-medium'}`}
						>
							<div
								className="reminders-item-icon"
								style={{ background: item.iconBg ?? itemIconBg }}
							>
								<i className={item.icon ?? itemIcon} aria-hidden />
							</div>
							<div className="reminders-item-body">
								<div className="reminders-item-title">{item.title}</div>
								{item.desc && (
									<div className="reminders-item-desc">{item.desc}</div>
								)}
								{item.time && (
									<div className="reminders-item-meta">{item.time}</div>
								)}
							</div>
							<i className="ri-arrow-right-s-line reminders-item-arrow" aria-hidden />
						</button>
					</li>
				))}
			</ul>
		)
	}

	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<span className="header-title">提醒</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="reminders-content">
					<div
						className={`reminders-summary ${totalCount > 0 ? 'has-alerts' : ''}`}
					>
						<span className="reminders-summary-text">待处理提醒</span>
						<span className="reminders-summary-count">{totalCount}</span>
					</div>

					<section className="reminders-section" aria-labelledby="reminders-risk-apps">
						<div className="reminders-section-header">
							<div className="reminders-section-icon apps">
								<i className="ri-virus-line" aria-hidden />
							</div>
							<h2 id="reminders-risk-apps" className="reminders-section-title">
								有病毒或风险的应用
							</h2>
						</div>
						{renderList(
							riskApps,
							'暂无风险应用',
							'ri-virus-line',
							'rgba(255, 77, 77, 0.15)',
						)}
					</section>

					<section
						className="reminders-section"
						aria-labelledby="reminders-risk-permission"
					>
						<div className="reminders-section-header">
							<div className="reminders-section-icon permission">
								<i className="ri-shield-cross-line" aria-hidden />
							</div>
							<h2 id="reminders-risk-permission" className="reminders-section-title">
								有风险的权限授予
							</h2>
						</div>
						{renderList(
							riskPermissions,
							'暂无风险权限记录',
							'ri-shield-cross-line',
							'rgba(255, 193, 7, 0.15)',
						)}
					</section>

					<section
						className="reminders-section"
						aria-labelledby="reminders-unreasonable-terms"
					>
						<div className="reminders-section-header">
							<div className="reminders-section-icon terms">
								<i className="ri-file-text-line" aria-hidden />
							</div>
							<h2 id="reminders-unreasonable-terms" className="reminders-section-title">
								不合理的隐私/安全条款
							</h2>
						</div>
						{renderList(
							unreasonableTerms,
							'暂无不合理条款',
							'ri-file-text-line',
							'rgba(74, 144, 226, 0.15)',
						)}
					</section>
				</div>
			</div>
		</div>
	)
}
