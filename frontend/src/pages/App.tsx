import { useState, useEffect, useRef } from 'react'
import type { AppListItem } from '../ts/AppList'
import type { NavView } from '../components/BottomNav'
import { BottomNav } from '../components/BottomNav'
import { Home } from './Home'
import { AppDetail } from './AppDetail'
import { AppListPage } from './AppList'
import { Privacy } from './Privacy'
import { Reminders } from './Reminders'
import { Settings } from './Settings'
import { UserAgreement } from './UserAgreement'

const ENTER_DELAY_MS = 32

export type SettingsOverlayType = 'userAgreement' | null

export function App() {
	const [view, setView] = useState<NavView>('home')
	const [selectedApp, setSelectedApp] = useState<AppListItem | null>(null)
	const [closingApp, setClosingApp] = useState<AppListItem | null>(null)
	const [detailVisible, setDetailVisible] = useState(false)
	const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

	const handleNavigate = (nextView: NavView) => {
		if (nextView !== 'apps') setSelectedApp(null)
		if (nextView !== 'settings') setSettingsOverlay(null)
		setView(nextView)
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
				{view === 'privacy' && <Privacy />}
				{view === 'reminders' && <Reminders />}
				{view === 'settings' && (
					<>
						<div className="app-views">
							<div className="app-view app-list-view">
								<Settings onOpenUserAgreement={() => setSettingsOverlay('userAgreement')} />
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
								<AppListPage onSelectApp={setSelectedApp} />
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
