export type NavView = 'home' | 'apps' | 'privacy' | 'reminders' | 'settings'

const NAV_ITEMS: { id: NavView; icon: string; label: string }[] = [
	{ id: 'home', icon: 'ri-home-4-line', label: '主页' },
	{ id: 'apps', icon: 'ri-apps-line', label: '应用' },
	{ id: 'privacy', icon: 'ri-shield-keyhole-line', label: '隐私' },
	{ id: 'reminders', icon: 'ri-notification-3-line', label: '提醒' },
	{ id: 'settings', icon: 'ri-settings-4-line', label: '设置' },
]

interface BottomNavProps {
	activeView: NavView
	onNavigate: (view: NavView) => void
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
	return (
		<nav className="bottom-nav" aria-label="主导航">
			{NAV_ITEMS.map(({ id, icon, label }) => (
				<button
					key={id}
					type="button"
					className={`nav-item ${activeView === id ? 'active' : ''}`}
					onClick={() => onNavigate(id)}
					aria-current={activeView === id ? 'page' : undefined}
				>
					<i className={`${icon} nav-icon`} aria-hidden />
					<span className="nav-label">{label}</span>
				</button>
			))}
		</nav>
	)
}
