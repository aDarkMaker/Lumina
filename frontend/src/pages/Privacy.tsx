export function Privacy() {
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
				<div className="section-title">
					<span>隐私与数据</span>
				</div>
				<p className="page-desc">
					本应用在设备本地分析权限与隐私条款，不上传您的敏感数据。规则与版本由服务端下发，移动端仅拉取规则配置。
				</p>
				<div className="section-title">
					<span>隐私政策</span>
				</div>
				<p className="page-desc">
					请在使用前阅读并同意我们的隐私政策与用户协议。我们重视您的隐私，不会将个人可识别信息用于商业目的。
				</p>
			</div>
		</div>
	)
}
