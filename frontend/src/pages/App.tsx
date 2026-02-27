import '../styles/app.css'
import { AppDetailsPage } from './AppDetailsPage'

export function App() {
	return (
		<div className="lumina-root">
			<div className="bg-decor">
				<div className="bg-circle bg-c-1" />
				<div className="bg-circle bg-c-2" />
			</div>
			<AppDetailsPage />
		</div>
	)
}

export default App

