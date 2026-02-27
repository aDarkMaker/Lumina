import { useState, useEffect, useRef } from 'react'
import type { AppListItem } from '../ts/AppList'
import { AppDetail } from './AppDetail'
import { AppListPage } from './AppList'

const ENTER_DELAY_MS = 32

export function App() {
	const [selectedApp, setSelectedApp] = useState<AppListItem | null>(null)
	const [closingApp, setClosingApp] = useState<AppListItem | null>(null)
	const [detailVisible, setDetailVisible] = useState(false)
	const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const showDetail = selectedApp ?? closingApp
	const isClosing = closingApp != null

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

	const handleBack = () => {
		if (selectedApp) {
			setClosingApp(selectedApp)
			setSelectedApp(null)
		}
	}

	const handleDetailTransitionEnd = (e: React.TransitionEvent) => {
		if (e.target !== e.currentTarget) return
		if (e.propertyName !== 'transform') return
		if (closingApp) setClosingApp(null)
	}

	return (
		<div className="lumina-root">
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
		</div>
	)
}

export default App
