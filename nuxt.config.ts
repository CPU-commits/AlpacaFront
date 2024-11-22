// import eslint from 'vite-plugin-eslint'
import { Logger } from './utils/logs'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			API: 'http://localhost:8080',
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
			title: 'Titulo',
			htmlAttrs: {
				lang: 'es',
			},
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
	security: {
		headers: {
			contentSecurityPolicy: {
				'img-src': ['*', 'data:', 'https:'],
			},
			crossOriginEmbedderPolicy: 'credentialless',
		},
	},
	compatibilityDate: '2024-10-03',
})
