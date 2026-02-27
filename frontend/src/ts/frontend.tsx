import { join } from 'path'
import { serve } from 'bun'
import index from '../pages/index.html'

const assetsDir = join(import.meta.dir, '../assets')
const stylesDir = join(import.meta.dir, '../styles')

const serveStyle = (path: string) => () =>
	new Response(Bun.file(join(stylesDir, path)), {
		headers: { 'Content-Type': 'text/css' },
	})

const server = serve({
	routes: {
		'/styles/app.css': serveStyle('app.css'),
		'/styles/base.css': serveStyle('base.css'),
		'/styles/layout.css': serveStyle('layout.css'),
		'/styles/view-transition.css': serveStyle('view-transition.css'),
		'/styles/header.css': serveStyle('header.css'),
		'/styles/app-info.css': serveStyle('app-info.css'),
		'/styles/stats.css': serveStyle('stats.css'),
		'/styles/permission.css': serveStyle('permission.css'),
		'/styles/switch.css': serveStyle('switch.css'),
		'/styles/bottom-nav.css': serveStyle('bottom-nav.css'),
		'/styles/app-list.css': serveStyle('app-list.css'),
		'/styles/decor.css': serveStyle('decor.css'),
		'/assets/fonts.css': () =>
			new Response(Bun.file(join(assetsDir, 'fonts.css')), {
				headers: { 'Content-Type': 'text/css' },
			}),
		'/assets/icons/remixicon.min.css': () =>
			new Response(Bun.file(join(assetsDir, 'icons/remixicon.min.css')), {
				headers: { 'Content-Type': 'text/css' },
			}),
		'/assets/icons/remixicon.woff2': () =>
			new Response(Bun.file(join(assetsDir, 'icons/remixicon.woff2')), {
				headers: { 'Content-Type': 'font/woff2' },
			}),
		'/assets/fonts/MiSans-Regular.ttf': () =>
			new Response(Bun.file(join(assetsDir, 'fonts/MiSans-Regular.ttf')), {
				headers: { 'Content-Type': 'font/ttf' },
			}),
		'/assets/fonts/MiSans-Medium.ttf': () =>
			new Response(Bun.file(join(assetsDir, 'fonts/MiSans-Medium.ttf')), {
				headers: { 'Content-Type': 'font/ttf' },
			}),
		'/assets/fonts/MiSans-Bold.ttf': () =>
			new Response(Bun.file(join(assetsDir, 'fonts/MiSans-Bold.ttf')), {
				headers: { 'Content-Type': 'font/ttf' },
			}),
		// Serve index.html for all unmatched routes.
		'/*': index,

		'/api/hello': {
			async GET(req) {
				return Response.json({
					message: 'Hello, world!',
					method: 'GET',
				})
			},
			async PUT(req) {
				return Response.json({
					message: 'Hello, world!',
					method: 'PUT',
				})
			},
		},

		'/api/hello/:name': async (req) => {
			const name = req.params.name
			return Response.json({
				message: `Hello, ${name}!`,
			})
		},
	},

	development: process.env.NODE_ENV !== 'production' && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
})

console.log(`🚀 Server running at ${server.url}`)
