export function Reminders() {
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
				<div className="section-title">
					<span>风险提醒</span>
				</div>
				<p className="page-desc">
					当检测到高危权限或隐私条款风险时，将在此处通知您。您可在此查看历史提醒记录。
				</p>
				<div className="empty-hint">
					<i className="ri-notification-3-line" aria-hidden />
					<span>暂无提醒</span>
				</div>
			</div>
		</div>
	)
}
