import { Service } from './service'
import { BlockConcurrentError } from '~/common/fetchModule'

export class CodeService extends Service {
	async generateCode(codeDTO: {
		duration: number
		type: string
		usesRemaining: number
	}) {
		try {
			await this.fetch({
				method: 'post',
				body: codeDTO,
				URL: '/api/generators/code',
				blockConcurrentFetch: true,
			})
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}

	async verifyCode(code: string, params?: { type: string }) {
		try {
			await this.fetch({
				method: 'get',
				URL: `/api/generators/code/verify/${code}`,
				params: params,
				blockConcurrentFetch: true,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}
}
