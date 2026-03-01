import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
	appId: 'com.lumina.app',
	appName: '烛照',
	webDir: 'dist',
	server: {
		allowNavigation: ['*'],
	},
	android: {
		allowMixedContent: true,
		captureInput: true,
	},
}

export default config
