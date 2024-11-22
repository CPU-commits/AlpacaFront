import { Logger } from '~~/utils/logs'

export default defineEventHandler((event) => {
	const url = event.req?.url ?? 'null'
	if (!url.includes('/api/session')) {
		const logger = new Logger()
		if (event.res.statusCode >= 400) {
			logger.error({
				message: url,
				context: 'log:middleware',
				labels: ['vue', 'client', 'error'],
			})
		} else {
			logger.trace({
				message: url,
				context: 'log:middleware',
				labels: ['vue', 'client'],
			})
		}
	}
})
