import { Service } from './service'

export class AuthService extends Service {
	async register(user: {
		email: string
		name: string
		password: string
		role: string
		username: string
	}) {
		try {
			throwIfFormHasError()

			await this.fetch({
				method: 'post',
				body: user,
				URL: '/api/auth/register',
			})
			await this.authStore.logIn({
				username: user.email,
				password: user.password,
			})
			return user.username
		} catch (err) {
			this.addErrorToast(err)
			return false
		}
	}

	async login(user: { email: string; password: string }) {
		try {
			return await this.authStore.logIn({
				username: user.email,
				password: user.password,
			})
		} catch (err) {
			this.addErrorToast(err)
			return false
		}
	}
}
