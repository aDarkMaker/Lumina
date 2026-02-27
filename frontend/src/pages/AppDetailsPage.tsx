export function AppDetailsPage() {
	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<span className="back-btn">‹</span>
					<span className="header-title">App Details</span>
				</div>
				<div className="header-right">
					<span className="header-dot" />
					<span className="header-dot" />
					<span className="header-dot" />
				</div>
			</div>

			<div className="content-scroll">
				<div className="app-info">
					<div className="app-icon-wrapper">
						<span className="app-icon-letter">L</span>
					</div>
					<h1 className="app-name">烛照</h1>
					<p className="app-version">Permission &amp; Privacy Inspector</p>

					<div className="action-buttons">
						<button className="btn btn-primary">开始扫描</button>
						<button className="btn btn-outline">最近报告</button>
					</div>
				</div>

				<div className="stats-container">
					<div className="stat-card">
						<span className="stat-value text-white">42</span>
						<span className="stat-label">已分析应用</span>
					</div>
					<div className="stat-card">
						<span className="stat-value text-red">5</span>
						<span className="stat-label">高危应用</span>
					</div>
					<div className="stat-card">
						<span className="stat-value text-green">37</span>
						<span className="stat-label">常规风险</span>
					</div>
				</div>

				<div className="section-title">
					<span>权限与敏感能力</span>
					<span>查看全部</span>
				</div>

				<div className="permission-item">
					<div className="perm-icon">📍</div>
					<div className="perm-content">
						<div className="perm-header">
							<span className="perm-name">位置信息（后台）</span>
							<div className="risk-badge risk-high">High Risk</div>
						</div>
						<p className="perm-desc">
							持续在后台访问精确位置，用于个性化推荐与广告投放。
						</p>
					</div>
					<div className="perm-toggle-placeholder">系统设置</div>
				</div>

				<div className="permission-item">
					<div className="perm-icon">🎙️</div>
					<div className="perm-content">
						<div className="perm-header">
							<span className="perm-name">麦克风</span>
							<div className="risk-badge risk-medium">Medium</div>
						</div>
						<p className="perm-desc">可在前台录音，用于语音输入与语音消息。</p>
					</div>
					<div className="perm-toggle-placeholder">系统设置</div>
				</div>

				<div className="permission-item">
					<div className="perm-icon">📂</div>
					<div className="perm-content">
						<div className="perm-header">
							<span className="perm-name">存储与相册</span>
							<div className="risk-badge risk-normal">Normal</div>
						</div>
						<p className="perm-desc">访问本地图片与文件，用于上传与备份。</p>
					</div>
					<div className="perm-toggle-placeholder">系统设置</div>
				</div>
			</div>

			<div className="bottom-nav">
				<button className="nav-item active">
					<span className="nav-icon">🏠</span>
					<span className="nav-label">总览</span>
				</button>
				<button className="nav-item">
					<span className="nav-icon">📱</span>
					<span className="nav-label">应用</span>
				</button>
				<button className="nav-item">
					<span className="nav-icon">🛡️</span>
					<span className="nav-label">隐私</span>
				</button>
				<button className="nav-item">
					<span className="nav-icon">🔔</span>
					<span className="nav-label">提醒</span>
				</button>
				<button className="nav-item">
					<span className="nav-icon">⚙️</span>
					<span className="nav-label">设置</span>
				</button>
			</div>
		</div>
	)
}
