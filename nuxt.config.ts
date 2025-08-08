// import eslint from 'vite-plugin-eslint'
import { Logger } from './utils/logs'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			API: 'http://localhost:8000',
			URL_CLIENT: 'http://localhost:3000',
			MERCADO_PAGO_PUBLIC_KEY: '',
		},
		cookies: {
			CRYPTO_KEY: 'ESTA_ES_UNA_LLAVE_DE_DESARROLLO',
			EXPIRY_IN_SECONDS: 60 * 60 * 2,
		},
	},
	devtools: { enabled: true },
	typescript: {
		strict: true,
		typeCheck: true,
	},
	css: ['@/assets/scss/main.scss'],
	modules: [
		'@pinia/nuxt',
		'nuxt-security',
		'@nuxtjs/google-fonts',
		'@nuxt/eslint',
		'@nuxtjs/i18n',
		'@nuxt/image',
		'vue3-carousel-nuxt',
	],
	imports: {
		dirs: ['stores'],
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData:
						'@use "@/assets/scss/_variables.scss" as *;',
				},
			},
		},
	},
	app: {
		head: {
			title: 'Alpaca Tattoo',
			htmlAttrs: {
				lang: 'es',
			},
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
			],
		},
	},
	image: {
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/dwz3wbwrr/image/upload/',
		},
	},
	hooks: {
		ready(nuxt) {
			const logger = new Logger()
			logger.info({
				message: `Ready nuxt app ${nuxt._version}`,
				context: 'nuxt:app',
				labels: ['init', 'server', 'client'],
			})
		},
		listen() {
			const logger = new Logger()
			logger.info({
				message: 'Listen nuxt app on port 3000',
				context: 'nuxt:app',
				labels: ['init', 'server', 'client'],
			})
		},
		close() {
			const logger = new Logger()
			logger.warn({
				message: 'Nuxt app stopped',
				context: 'nuxt:app',
				labels: ['init', 'server', 'client'],
			})
		},
	},
	i18n: {
		locales: [
			{ code: 'en', file: 'en.json' },
			{ code: 'es', file: 'es.json' },
		],
		defaultLocale: 'es',
		langDir: 'langs',
		strategy: 'prefix_except_default',
	},
	security: {
		headers: {
			contentSecurityPolicy: {
				'img-src': ['*', 'data:', 'https:'],
			},
			crossOriginEmbedderPolicy: 'credentialless',
		},
	},
	compatibilityDate: '2024-10-03',
	eslint: {
		checker: true,
	},
})
