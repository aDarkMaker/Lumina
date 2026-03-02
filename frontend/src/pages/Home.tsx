import { useEffect, useState } from 'react'
import { getAppList } from '../ts/AppList'

export interface HomeRiskItem {
	id: string
	name: string
	icon: string
	iconBg: string
	tag: string
	tagType: 'danger' | 'warning'
}

export function Home() {
	const [analyzedCount, setAnalyzedCount] = useState(0)
	const [riskItems, setRiskItems] = useState<HomeRiskItem[]>([])

	useEffect(() => {
		getAppList().then((apps) => setAnalyzedCount(apps.length))
	}, [])

	// 高风险行为列表后续从实际扫描结果实时获取并 setRiskItems，当前置空

	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<span className="header-title">总览</span>
				</div>
				<div className="header-right">
					<i className="ri-search-2-line header-icon" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="home-content">
					<div className="home-hero-card">
						<div className="home-hero-status">
							<div className="home-shield-icon">
								<i className="ri-shield-check-fill" aria-hidden />
							</div>
							<div className="home-hero-text">
								<h2>当前设备安全</h2>
								<p>实时监控已开启，未发现异常</p>
							</div>
						</div>
						<button type="button" className="home-scan-btn">
							<i className="ri-scan-2-line" aria-hidden />
							立即全面扫描
						</button>
					</div>

					<div className="home-stats-grid">
						<div className="home-stat-card home-stat-apps">
							<div className="home-stat-icon">
								<i className="ri-apps-line" aria-hidden />
							</div>
							<div className="home-stat-value">{analyzedCount}</div>
							<div className="home-stat-label">已分析应用</div>
						</div>
						<div className="home-stat-card home-stat-risk">
							<div className="home-stat-icon">
								<i className="ri-alert-line" aria-hidden />
							</div>
							<div className="home-stat-value">0</div>
							<div className="home-stat-label">高风险权限</div>
						</div>
						<div className="home-stat-card home-stat-terms">
							<div className="home-stat-icon">
								<i className="ri-file-text-line" aria-hidden />
							</div>
							<div className="home-stat-value">0</div>
							<div className="home-stat-label">不合理条款</div>
						</div>
					</div>

					<div className="home-section-header">
						<span className="home-section-title">高风险权限</span>
						<button type="button" className="home-section-more">
							查看全部
						</button>
					</div>

					<ul className="home-risk-list">
						{riskItems.length === 0 ? (
							<li className="home-risk-empty">
								<span>暂无高风险行为</span>
							</li>
						) : (
							riskItems.map((item) => (
								<li key={item.id}>
									<button type="button" className="home-risk-item">
										<div className="home-risk-item-left">
											<div
												className="home-risk-app-icon"
												style={{ background: item.iconBg }}
											>
												<i
													className={item.icon}
													aria-hidden
													style={
														item.iconBg.includes('78ffd6') ||
														item.iconBg.includes('999')
															? { color: '#000' }
															: undefined
													}
												/>
											</div>
											<div className="home-risk-app-info">
												<span className="home-risk-app-name">
													{item.name}
												</span>
												<span
													className={`home-risk-tag ${item.tagType === 'danger' ? 'home-risk-tag-danger' : 'home-risk-tag-warning'}`}
												>
													{item.tag}
												</span>
											</div>
										</div>
										<div className="home-risk-action">
											<i className="ri-arrow-right-s-line" aria-hidden />
										</div>
									</button>
								</li>
							))
						)}
					</ul>
				</div>
			</div>
		</div>
	)
}
