export function Home() {
	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<span className="header-title">总览</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="app-info home-hero">
					<div className="app-icon-wrapper">
						<i className="ri-shield-keyhole-fill app-icon-ri" aria-hidden />
					</div>
					<h1 className="app-name">烛照</h1>
					<p className="app-version">Permission &amp; Privacy Inspector</p>

					<div className="action-buttons">
						<button type="button" className="btn btn-primary">
							开始扫描
						</button>
						<button type="button" className="btn btn-outline">
							最近报告
						</button>
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
					<span>快捷入口</span>
					<span>查看全部</span>
				</div>
				<p className="page-desc">
					在「应用」中查看已安装应用列表与权限详情；在「隐私」中了解数据与隐私政策。
				</p>
			</div>
		</div>
	)
}
