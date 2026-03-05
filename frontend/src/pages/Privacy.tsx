import { useEffect, useState } from 'react'
import {
	getPrivacyTermsList,
	sortPrivacyTerms,
	type PrivacyTermsItem,
	type PrivacyTermsSortOption,
} from '../ts/PrivacyTerms'

export interface PrivacyProps {
	privacyTermsSort: PrivacyTermsSortOption
	onSelectTerm: (term: PrivacyTermsItem) => void
}

export function Privacy({ privacyTermsSort, onSelectTerm }: PrivacyProps) {
	const [terms, setTerms] = useState<PrivacyTermsItem[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getPrivacyTermsList()
			.then((list) => setTerms(sortPrivacyTerms(list, privacyTermsSort)))
			.finally(() => setLoading(false))
	}, [privacyTermsSort])

	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<span className="header-title">隐私</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="privacy-content">
					<div className="privacy-list-summary">
						<span className="privacy-list-count">共 {terms.length} 条隐私条款</span>
					</div>

					{loading ? (
						<div className="privacy-list-loading">
							<i className="ri-loader-4-line spin" aria-hidden />
							<span>加载中…</span>
						</div>
					) : (
						<ul className="privacy-list">
							{terms.map((item) => (
								<li key={item.id}>
									<button
										type="button"
										className="privacy-term-row"
										onClick={() => onSelectTerm(item)}
									>
										<div className="privacy-term-icon">
											{item.appIcon ? (
												<img src={item.appIcon} alt="" />
											) : (
												<i className="ri-file-text-line" aria-hidden />
											)}
										</div>
										<div className="privacy-term-info">
											<span className="privacy-term-name">
												{item.appName}
											</span>
											<span className="privacy-term-summary">
												{item.summary}
											</span>
										</div>
										{item.riskLevel != null && (
											<div
												className={`risk-badge risk-${item.riskLevel}`}
												aria-label={`风险: ${item.riskLevel}`}
											>
												{item.riskLevel === 'high'
													? '高危'
													: item.riskLevel === 'medium'
														? '中危'
														: '常规'}
											</div>
										)}
										<i
											className="ri-arrow-right-s-line privacy-term-chevron"
											aria-hidden
										/>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	)
}
