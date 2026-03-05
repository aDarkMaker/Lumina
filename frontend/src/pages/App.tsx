import { useState, useEffect, useRef } from 'react'
import type { AppListItem, AppListSortOption } from '../ts/AppList'
import type { NavView } from '../components/BottomNav'
import { BottomNav } from '../components/BottomNav'
import { Home } from './Home'
import { AppDetail } from './AppDetail'
import { AppListPage } from './AppList'
import type { PrivacyTermsItem } from '../ts/PrivacyTerms'
import { Privacy } from './Privacy'
import { PrivacyTermDetail } from './PrivacyTermDetail'
import { Reminders } from './Reminders'
import { Settings } from './Settings'
import { UserAgreement } from './UserAgreement'

const ENTER_DELAY_MS = 32
const STORAGE_KEY_SHOW_RISK_BADGE = 'lumina_showRiskBadge'
const STORAGE_KEY_PRIVACY_TERMS_SORT = 'lumina_privacyTermsSort'
const STORAGE_KEY_APP_LIST_SORT = 'lumina_appListSort'

const DEFAULT_PRIVACY_TERMS_SORT = '按应用名称' as const
const DEFAULT_APP_LIST_SORT = '按风险等级' as const
type PrivacyTermsSort = '按应用名称' | '按风险等级' | '按更新时间'

function readShowRiskBadge(): boolean {
	try {
		const v = localStorage.getItem(STORAGE_KEY_SHOW_RISK_BADGE)
		return v !== null ? v === 'true' : true
	} catch {
		return true
	}
}

function readPrivacyTermsSort(): PrivacyTermsSort {
	try {
		const v = localStorage.getItem(STORAGE_KEY_PRIVACY_TERMS_SORT) as PrivacyTermsSort | null
		if (v === '按应用名称' || v === '按风险等级' || v === '按更新时间') return v
		return DEFAULT_PRIVACY_TERMS_SORT
	} catch {
		return DEFAULT_PRIVACY_TERMS_SORT
	}
}

function readAppListSort(): AppListSortOption {
	try {
		const v = localStorage.getItem(STORAGE_KEY_APP_LIST_SORT) as AppListSortOption | null
		if (v === '按风险等级' || v === '按名称' || v === '按安装时间' || v === '按大小') return v
		return DEFAULT_APP_LIST_SORT
	} catch {
		return DEFAULT_APP_LIST_SORT
	}
}

export type SettingsOverlayType = 'userAgreement' | null

export function App() {
	const [view, setView] = useState<NavView>('home')
	const [selectedApp, setSelectedApp] = useState<AppListItem | null>(null)
	const [closingApp, setClosingApp] = useState<AppListItem | null>(null)
	const [detailVisible, setDetailVisible] = useState(false)
	const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const [showRiskBadge, setShowRiskBadgeState] = useState(readShowRiskBadge)
	const setShowRiskBadge = (value: boolean) => {
		setShowRiskBadgeState(value)
		try {
			localStorage.setItem(STORAGE_KEY_SHOW_RISK_BADGE, String(value))
		} catch {
			// ignore
		}
	}

	const [privacyTermsSort, setPrivacyTermsSortState] = useState(readPrivacyTermsSort)
	const setPrivacyTermsSort = (value: PrivacyTermsSort) => {
		setPrivacyTermsSortState(value)
		try {
			localStorage.setItem(STORAGE_KEY_PRIVACY_TERMS_SORT, value)
		} catch {
			// ignore
		}
	}

	const [appListSort, setAppListSortState] = useState(readAppListSort)
	const setAppListSort = (value: AppListSortOption) => {
		setAppListSortState(value)
		try {
			localStorage.setItem(STORAGE_KEY_APP_LIST_SORT, value)
		} catch {
			// ignore
		}
	}

	const [settingsOverlay, setSettingsOverlay] = useState<SettingsOverlayType>(null)
	const [closingSettingsOverlay, setClosingSettingsOverlay] = useState(false)
	const [settingsDetailVisible, setSettingsDetailVisible] = useState(false)
	const settingsEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const showDetail = selectedApp ?? closingApp
	const isClosing = closingApp != null
	const showSettingsOverlay = settingsOverlay === 'userAgreement'
	const isClosingSettings = closingSettingsOverlay

	useEffect(() => {
		if (selectedApp && !closingApp) {
			setDetailVisible(false)
			enterTimerRef.current = setTimeout(() => {
				setDetailVisible(true)
				enterTimerRef.current = null
			}, ENTER_DELAY_MS)
			return () => {
				if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
			}
		}
		setDetailVisible(false)
	}, [selectedApp, closingApp])

	useEffect(() => {
		if (settingsOverlay && !closingSettingsOverlay) {
			setSettingsDetailVisible(false)
			settingsEnterTimerRef.current = setTimeout(() => {
				setSettingsDetailVisible(true)
				settingsEnterTimerRef.current = null
			}, ENTER_DELAY_MS)
			return () => {
				if (settingsEnterTimerRef.current) clearTimeout(settingsEnterTimerRef.current)
			}
		}
		setSettingsDetailVisible(false)
	}, [settingsOverlay, closingSettingsOverlay])

	const [selectedPrivacyTerm, setSelectedPrivacyTerm] = useState<PrivacyTermsItem | null>(null)
	const [closingPrivacyTerm, setClosingPrivacyTerm] = useState<PrivacyTermsItem | null>(null)
	const [privacyDetailVisible, setPrivacyDetailVisible] = useState(false)
	const privacyEnterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const showPrivacyDetail = selectedPrivacyTerm ?? closingPrivacyTerm
	const isClosingPrivacy = closingPrivacyTerm != null

	useEffect(() => {
		if (selectedPrivacyTerm && !closingPrivacyTerm) {
			setPrivacyDetailVisible(false)
			privacyEnterTimerRef.current = setTimeout(() => {
				setPrivacyDetailVisible(true)
				privacyEnterTimerRef.current = null
			}, ENTER_DELAY_MS)
			return () => {
				if (privacyEnterTimerRef.current) clearTimeout(privacyEnterTimerRef.current)
			}
		}
		setPrivacyDetailVisible(false)
	}, [selectedPrivacyTerm, closingPrivacyTerm])

	const handleNavigate = (nextView: NavView) => {
		if (nextView !== 'apps') setSelectedApp(null)
		if (nextView !== 'settings') setSettingsOverlay(null)
		if (nextView !== 'privacy') setSelectedPrivacyTerm(null)
		setView(nextView)
	}

	const handlePrivacyTermBack = () => {
		if (selectedPrivacyTerm) {
			setClosingPrivacyTerm(selectedPrivacyTerm)
			setSelectedPrivacyTerm(null)
		}
	}

	const handlePrivacyDetailTransitionEnd = (e: React.TransitionEvent) => {
		if (e.target !== e.currentTarget) return
		if (e.propertyName !== 'transform') return
		if (closingPrivacyTerm) setClosingPrivacyTerm(null)
	}

	const handleBack = () => {
		if (selectedApp) {
			setClosingApp(selectedApp)
			setSelectedApp(null)
		}
	}

	const handleSettingsOverlayBack = () => {
		setClosingSettingsOverlay(true)
	}

	const handleDetailTransitionEnd = (e: React.TransitionEvent) => {
		if (e.target !== e.currentTarget) return
		if (e.propertyName !== 'transform') return
		if (closingApp) setClosingApp(null)
	}

	const handleSettingsOverlayTransitionEnd = (e: React.TransitionEvent) => {
		if (e.target !== e.currentTarget) return
		if (e.propertyName !== 'transform') return
		if (closingSettingsOverlay) {
			setSettingsOverlay(null)
			setClosingSettingsOverlay(false)
		}
	}

	return (
		<div className="lumina-root">
			<div className="view-container">
				{view === 'home' && <Home />}
				{view === 'privacy' && (
					<>
						<div className="app-views">
							<div className="app-view app-list-view">
								<Privacy
									privacyTermsSort={privacyTermsSort}
									onSelectTerm={setSelectedPrivacyTerm}
								/>
							</div>
							{showPrivacyDetail && (
								<div
									className={`app-view app-detail-view ${privacyDetailVisible && !isClosingPrivacy ? 'visible' : ''} ${isClosingPrivacy ? 'closing' : ''}`}
									onTransitionEnd={handlePrivacyDetailTransitionEnd}
								>
									<PrivacyTermDetail
										key={(selectedPrivacyTerm ?? closingPrivacyTerm)?.id}
										term={selectedPrivacyTerm ?? closingPrivacyTerm}
										onBack={handlePrivacyTermBack}
									/>
								</div>
							)}
						</div>
					</>
				)}
				{view === 'reminders' && <Reminders />}
				{view === 'settings' && (
					<>
						<div className="app-views">
							<div className="app-view app-list-view">
								<Settings
									showRiskBadge={showRiskBadge}
									onShowRiskBadgeChange={setShowRiskBadge}
									sortBy={appListSort}
									onSortByChange={setAppListSort}
									privacyTermsSort={privacyTermsSort}
									onPrivacyTermsSortChange={setPrivacyTermsSort}
									onOpenUserAgreement={() => setSettingsOverlay('userAgreement')}
								/>
							</div>
							{showSettingsOverlay && (
								<div
									className={`app-view app-detail-view ${settingsDetailVisible && !isClosingSettings ? 'visible' : ''} ${isClosingSettings ? 'closing' : ''}`}
									onTransitionEnd={handleSettingsOverlayTransitionEnd}
								>
									<UserAgreement onBack={handleSettingsOverlayBack} />
								</div>
							)}
						</div>
					</>
				)}
				{view === 'apps' && (
					<>
						<div className="app-views">
							<div className="app-view app-list-view">
								<AppListPage
									showRiskBadge={showRiskBadge}
									sortBy={appListSort}
									onSelectApp={setSelectedApp}
								/>
							</div>
							{showDetail && (
								<div
									className={`app-view app-detail-view ${detailVisible && !isClosing ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}
									onTransitionEnd={handleDetailTransitionEnd}
								>
									<AppDetail
										key={(selectedApp ?? closingApp)?.id}
										app={selectedApp ?? closingApp}
										onBack={handleBack}
									/>
								</div>
							)}
						</div>
					</>
				)}
			</div>
			<BottomNav activeView={view} onNavigate={handleNavigate} />
		</div>
	)
}

export default App
