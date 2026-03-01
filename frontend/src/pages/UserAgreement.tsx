interface UserAgreementProps {
	onBack: () => void
}

export function UserAgreement({ onBack }: UserAgreementProps) {
	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<button type="button" className="back-btn" onClick={onBack} aria-label="返回">
						<i className="ri-arrow-left-line" aria-hidden />
					</button>
					<span className="header-title">用户协议</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="settings-content">
					<div className="section-title">
						<span>这下边全是AI写的</span>
					</div>
					<p className="page-desc">
						请您在使用本应用前仔细阅读本协议。使用本应用即表示您同意本协议的全部内容。
					</p>
					<div className="section-title">
						<span>一、服务说明</span>
					</div>
					<p className="page-desc">
						烛照是一款应用权限与隐私政策风险分析工具，在设备本地完成分析，不上传您的敏感数据。规则与版本由服务端下发，移动端仅拉取规则配置。
					</p>
					<div className="section-title">
						<span>二、使用规范</span>
					</div>
					<p className="page-desc">
						您应合法、合规使用本服务，不得将本应用用于任何商业或营利目的。请勿利用本应用从事违反法律法规或侵害他人权益的行为。
					</p>
					<div className="section-title">
						<span>三、免责声明</span>
					</div>
					<p className="page-desc">
						本应用的分析结果仅供参考，不构成任何法律或专业建议。因使用或无法使用本应用而产生的任何直接或间接损失，开发者不承担责任。
					</p>
					<div className="section-title">
						<span>四、协议变更</span>
					</div>
					<p className="page-desc">
						我们可能适时修订本协议，修订后的协议将在应用内公布。若您继续使用本应用，即视为接受修订后的协议。
					</p>
				</div>
			</div>
		</div>
	)
}
