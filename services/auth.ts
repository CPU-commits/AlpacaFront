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

	async updateEmail(newEmail: { newEmail: string }) {
		try {
			await this.fetch({
				method: 'patch',
				body: newEmail,
				URL: '/api/auth/email',
			})
			return true
		} catch (err: any) {
			if (err.response?.status != 200) {
				const error = new Error(
					'No se pudo cambiar el correo electrónico',
				)
				this.addErrorToast(error)
			}
			return false
		}
	}
	async updatePassword(newPassword: { newPassword: string }) {
		try {
			await this.fetch({
				method: 'patch',
				body: newPassword,
				URL: '/api/auth/password',
			})
			return true
		} catch (err) {
			this.addErrorToast(err)
			return false
		}
	}
	async updateUser(
		userData: {
			name?: string
			phone?: string
			location?: string
			addMedia?: Array<{
				type: string
				link: string
			}>
			removeMedia?: Array<number>
		},
		namespace?: string,
	) {
		try {
			throwIfFormHasError(namespace)
			await this.fetch({
				method: 'patch',
				body: userData,
				URL: '/api/auth/user',
			})

			return true
		} catch (err: any) {
			if (err.response?.status === 401) {
				const error = new Error('No se pudo cambiar la contraseña')
				this.addErrorToast(error)
			} else {
				this.addErrorToast(err)
			}
			return false
		}
	}

	async isOwner(params?: { username: string; id: number }) {
		try {
			return this.fetch({
				method: 'get',
				URL: '/api/auth',
				params: params,
			})
		} catch (e) {
			console.log(e)
			return false
		}
	}
}
