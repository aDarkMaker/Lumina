import type { PrivacyTermsItem } from '../ts/PrivacyTerms'

export interface PrivacyTermDetailProps {
	term: PrivacyTermsItem
	onBack: () => void
}

export function PrivacyTermDetail({ term, onBack }: PrivacyTermDetailProps) {
	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<button type="button" className="back-btn" onClick={onBack} aria-label="返回">
						<i className="ri-arrow-left-line" aria-hidden />
					</button>
					<span className="header-title">{term.appName}</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="settings-content">
					<p className="page-desc">{term.content}</p>
				</div>
			</div>
		</div>
	)
}
