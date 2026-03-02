import { useState, useRef, useEffect } from 'react'
import { Switch } from '../components/Switch'

const SCAN_FREQUENCY_OPTIONS = ['每日', '每周', '仅 Wi‑Fi 时', '手动'] as const
const SORT_OPTIONS = ['按风险等级', '按名称', '按安装时间', '按大小'] as const
const PRIVACY_TERMS_SORT_OPTIONS = ['按应用名称', '按风险等级', '按更新时间'] as const

type ScanFrequency = (typeof SCAN_FREQUENCY_OPTIONS)[number]
type SortBy = (typeof SORT_OPTIONS)[number]
type PrivacyTermsSort = (typeof PRIVACY_TERMS_SORT_OPTIONS)[number]

type PickerType = 'scanFrequency' | 'sortBy' | 'privacyTermsSort' | null

const DEFAULT_SETTINGS = {
	scanFrequency: '每日' as ScanFrequency,
	highRiskAlert: true,
	mediumRiskAlert: false,
	newAppAlert: true,
	ruleAutoUpdate: true,
	sortBy: '按风险等级' as SortBy,
	privacyTermsSort: '按应用名称' as PrivacyTermsSort,
	showRiskBadge: true,
	anonymousStats: false,
}

interface SettingsProps {
	showRiskBadge?: boolean
	onShowRiskBadgeChange?: (value: boolean) => void
	sortBy?: SortBy
	onSortByChange?: (value: SortBy) => void
	privacyTermsSort?: PrivacyTermsSort
	onPrivacyTermsSortChange?: (value: PrivacyTermsSort) => void
	onOpenUserAgreement?: () => void
}

export function Settings({
	showRiskBadge: showRiskBadgeProp,
	onShowRiskBadgeChange,
	sortBy: sortByProp,
	onSortByChange,
	privacyTermsSort: privacyTermsSortProp,
	onPrivacyTermsSortChange,
	onOpenUserAgreement,
}: SettingsProps) {
	const [scanFrequency, setScanFrequency] = useState<ScanFrequency>(
		DEFAULT_SETTINGS.scanFrequency,
	)
	const [highRiskAlert, setHighRiskAlert] = useState(DEFAULT_SETTINGS.highRiskAlert)
	const [mediumRiskAlert, setMediumRiskAlert] = useState(DEFAULT_SETTINGS.mediumRiskAlert)
	const [newAppAlert, setNewAppAlert] = useState(DEFAULT_SETTINGS.newAppAlert)
	const [ruleAutoUpdate, setRuleAutoUpdate] = useState(DEFAULT_SETTINGS.ruleAutoUpdate)
	const [sortByLocal, setSortByLocal] = useState<SortBy>(DEFAULT_SETTINGS.sortBy)
	const sortBy = onSortByChange && sortByProp !== undefined ? sortByProp : sortByLocal
	const setSortBy = onSortByChange ?? setSortByLocal
	const [privacyTermsSortLocal, setPrivacyTermsSortLocal] = useState<PrivacyTermsSort>(
		DEFAULT_SETTINGS.privacyTermsSort,
	)
	const privacyTermsSort =
		onPrivacyTermsSortChange && privacyTermsSortProp !== undefined
			? privacyTermsSortProp
			: privacyTermsSortLocal
	const setPrivacyTermsSort = onPrivacyTermsSortChange ?? setPrivacyTermsSortLocal
	const [showRiskBadgeLocal, setShowRiskBadgeLocal] = useState(DEFAULT_SETTINGS.showRiskBadge)
	const showRiskBadge =
		onShowRiskBadgeChange && showRiskBadgeProp !== undefined
			? showRiskBadgeProp
			: showRiskBadgeLocal
	const setShowRiskBadge = onShowRiskBadgeChange ?? setShowRiskBadgeLocal
	const [anonymousStats, setAnonymousStats] = useState(DEFAULT_SETTINGS.anonymousStats)
	const [openPicker, setOpenPicker] = useState<PickerType>(null)
	const [dropdownRect, setDropdownRect] = useState<{
		top: number
		left: number
		width: number
	} | null>(null)
	const [isClosing, setClosing] = useState(false)
	const [dropdownOpenAnimated, setDropdownOpenAnimated] = useState(false)
	const scanFreqRef = useRef<HTMLButtonElement>(null)
	const sortByRef = useRef<HTMLButtonElement>(null)
	const privacyTermsSortRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!openPicker) {
			setDropdownRect(null)
			setDropdownOpenAnimated(false)
			return
		}
		setClosing(false)
		const el =
			openPicker === 'scanFrequency'
				? scanFreqRef.current
				: openPicker === 'sortBy'
					? sortByRef.current
					: privacyTermsSortRef.current
		if (!el) return
		const rect = el.getBoundingClientRect()
		setDropdownRect({
			top: rect.bottom - 2,
			left: rect.left,
			width: rect.width,
		})
		let raf2: number | undefined
		const raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => setDropdownOpenAnimated(true))
		})
		return () => {
			cancelAnimationFrame(raf1)
			if (raf2 !== undefined) cancelAnimationFrame(raf2)
		}
	}, [openPicker])

	useEffect(() => {
		if (!isClosing) return
		const t = setTimeout(() => {
			setOpenPicker(null)
			setDropdownRect(null)
			setClosing(false)
		}, 220)
		return () => clearTimeout(t)
	}, [isClosing])

	const closeDropdown = () => {
		setClosing(true)
	}

	const handleReset = () => {
		setScanFrequency(DEFAULT_SETTINGS.scanFrequency)
		setHighRiskAlert(DEFAULT_SETTINGS.highRiskAlert)
		setMediumRiskAlert(DEFAULT_SETTINGS.mediumRiskAlert)
		setNewAppAlert(DEFAULT_SETTINGS.newAppAlert)
		setRuleAutoUpdate(DEFAULT_SETTINGS.ruleAutoUpdate)
		setSortBy(DEFAULT_SETTINGS.sortBy)
		setPrivacyTermsSort(DEFAULT_SETTINGS.privacyTermsSort)
		setShowRiskBadge(DEFAULT_SETTINGS.showRiskBadge)
		setAnonymousStats(DEFAULT_SETTINGS.anonymousStats)
	}

	return (
		<div className="mobile-screen">
			<div className="screen-reflection" />

			<div className="header">
				<div className="header-left">
					<span className="header-title">设置</span>
				</div>
				<div className="header-right">
					<i className="ri-more-fill" aria-hidden />
				</div>
			</div>

			<div className="content-scroll">
				<div className="settings-content">
					<div className="section-title">
						<span>通用</span>
					</div>
					<div className="settings-group">
						<button
							ref={scanFreqRef}
							type="button"
							className="settings-row settings-row-tappable"
							aria-expanded={
								openPicker === 'scanFrequency' && dropdownOpenAnimated && !isClosing
							}
							aria-haspopup="listbox"
							onClick={() =>
								setOpenPicker(
									openPicker === 'scanFrequency' ? null : 'scanFrequency',
								)
							}
						>
							<span>扫描频率</span>
							<span className="settings-row-right">
								<span className="settings-value">{scanFrequency}</span>
								<i
									className="ri-arrow-right-s-line settings-chevron settings-chevron-dropdown"
									aria-hidden
								/>
							</span>
						</button>
						<div className="settings-row settings-row-with-switch">
							<span>高危应用提醒</span>
							<Switch
								checked={highRiskAlert}
								onChange={setHighRiskAlert}
								aria-label="高危应用提醒"
							/>
						</div>
						<div className="settings-row settings-row-with-switch">
							<span>中危应用提醒</span>
							<Switch
								checked={mediumRiskAlert}
								onChange={setMediumRiskAlert}
								aria-label="中危应用提醒"
							/>
						</div>
						<div className="settings-row settings-row-with-switch">
							<span>新应用安装提醒</span>
							<Switch
								checked={newAppAlert}
								onChange={setNewAppAlert}
								aria-label="新应用安装提醒"
							/>
						</div>
						<div className="settings-row settings-row-with-switch">
							<span>规则自动更新</span>
							<Switch
								checked={ruleAutoUpdate}
								onChange={setRuleAutoUpdate}
								aria-label="规则自动更新"
							/>
						</div>
					</div>

					<div className="section-title">
						<span>展示与排序</span>
					</div>
					<div className="settings-group">
						<button
							ref={sortByRef}
							type="button"
							className="settings-row settings-row-tappable"
							aria-expanded={
								openPicker === 'sortBy' && dropdownOpenAnimated && !isClosing
							}
							aria-haspopup="listbox"
							onClick={() => setOpenPicker(openPicker === 'sortBy' ? null : 'sortBy')}
						>
							<span>应用列表排序</span>
							<span className="settings-row-right">
								<span className="settings-value">{sortBy}</span>
								<i
									className="ri-arrow-right-s-line settings-chevron settings-chevron-dropdown"
									aria-hidden
								/>
							</span>
						</button>
						<button
							ref={privacyTermsSortRef}
							type="button"
							className="settings-row settings-row-tappable"
							aria-expanded={
								openPicker === 'privacyTermsSort' &&
								dropdownOpenAnimated &&
								!isClosing
							}
							aria-haspopup="listbox"
							onClick={() =>
								setOpenPicker(
									openPicker === 'privacyTermsSort' ? null : 'privacyTermsSort',
								)
							}
						>
							<span>隐私条款排序</span>
							<span className="settings-row-right">
								<span className="settings-value">{privacyTermsSort}</span>
								<i
									className="ri-arrow-right-s-line settings-chevron settings-chevron-dropdown"
									aria-hidden
								/>
							</span>
						</button>
						<div className="settings-row settings-row-with-switch">
							<span>显示风险标签</span>
							<Switch
								checked={showRiskBadge}
								onChange={setShowRiskBadge}
								aria-label="显示风险标签"
							/>
						</div>
					</div>

					<div className="section-title">
						<span>隐私与数据</span>
					</div>
					<div className="settings-group">
						<div className="settings-row settings-row-with-switch">
							<span>匿名使用统计</span>
							<Switch
								checked={anonymousStats}
								onChange={setAnonymousStats}
								aria-label="匿名使用统计"
							/>
						</div>
					</div>

					<div className="section-title">
						<span>关于</span>
					</div>
					<div className="settings-group">
						<div className="settings-row">
							<span>应用版本</span>
							<span className="settings-value">1.0.0</span>
						</div>
						<div className="settings-row">
							<span>规则版本</span>
							<span className="settings-value">—</span>
						</div>
						<button
							type="button"
							className="settings-row settings-link"
							onClick={() => onOpenUserAgreement?.()}
						>
							<span>用户协议</span>
							<i className="ri-arrow-right-s-line settings-chevron" aria-hidden />
						</button>
					</div>
				</div>
			</div>

			{openPicker && dropdownRect && (
				<>
					<div
						className="settings-dropdown-backdrop"
						onClick={closeDropdown}
						aria-hidden
					/>
					<div
						className={`settings-dropdown ${dropdownOpenAnimated && !isClosing ? 'settings-dropdown-open' : ''} ${isClosing ? 'settings-dropdown-closing' : ''}`}
						role="listbox"
						aria-label={
							openPicker === 'scanFrequency'
								? '选择扫描频率'
								: openPicker === 'sortBy'
									? '选择应用列表排序'
									: '选择隐私条款排序'
						}
						style={{
							top: dropdownRect.top,
							left: dropdownRect.left,
							width: dropdownRect.width,
						}}
					>
						<ul className="settings-dropdown-list">
							{openPicker === 'scanFrequency' &&
								SCAN_FREQUENCY_OPTIONS.map((opt) => (
									<li key={opt}>
										<button
											type="button"
											role="option"
											aria-selected={scanFrequency === opt}
											className={`settings-dropdown-option ${scanFrequency === opt ? 'selected' : ''}`}
											onClick={() => setScanFrequency(opt)}
										>
											{opt}
											{scanFrequency === opt && (
												<i
													className="ri-check-line settings-picker-check"
													aria-hidden
												/>
											)}
										</button>
									</li>
								))}
							{openPicker === 'sortBy' &&
								SORT_OPTIONS.map((opt) => (
									<li key={opt}>
										<button
											type="button"
											role="option"
											aria-selected={sortBy === opt}
											className={`settings-dropdown-option ${sortBy === opt ? 'selected' : ''}`}
											onClick={() => setSortBy(opt)}
										>
											{opt}
											{sortBy === opt && (
												<i
													className="ri-check-line settings-picker-check"
													aria-hidden
												/>
											)}
										</button>
									</li>
								))}
							{openPicker === 'privacyTermsSort' &&
								PRIVACY_TERMS_SORT_OPTIONS.map((opt) => (
									<li key={opt}>
										<button
											type="button"
											role="option"
											aria-selected={privacyTermsSort === opt}
											className={`settings-dropdown-option ${privacyTermsSort === opt ? 'selected' : ''}`}
											onClick={() => setPrivacyTermsSort(opt)}
										>
											{opt}
											{privacyTermsSort === opt && (
												<i
													className="ri-check-line settings-picker-check"
													aria-hidden
												/>
											)}
										</button>
									</li>
								))}
						</ul>
					</div>
				</>
			)}
		</div>
	)
}
