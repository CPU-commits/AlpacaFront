import { BlockConcurrentError } from '~/common/fetchModule'
import { Service } from './service'
import type { Studio } from '~/models/studio/studio.model'
import type { StudioPermission } from '~/models/studio/permission.model'
import type { StudioPerson, StudioRole } from '~/models/studio/person.model'

export class StudioService extends Service {
	async getStudios() {
		return await this.fetch<Array<Studio> | null>({
			method: 'get',
			URL: '/api/studios/my',
		}).then((studios) => studios ?? [])
	}

	async getStudio(idStudio: number) {
		return await this.fetch<Studio>({
			method: 'get',
			URL: `/api/studios/${idStudio}`,
		})
	}

	async getStudioUsername(idStudio: number) {
		return await this.fetch<{ username: string }>({
			method: 'get',
			URL: `/api/studios/${idStudio}/username`,
		})
	}

	async getStudioPeople(idStudio: number) {
		return await this.fetch<Array<StudioPerson>>({
			method: 'get',
			URL: `/api/studios/${idStudio}/people`,
		})
	}

	async getStudioTattooArtists(idStudio: number) {
		return await this.fetch<Array<StudioPerson>>({
			method: 'get',
			URL: `/api/studios/${idStudio}/tattooArtists`,
		})
	}

	async getStudioPermissions() {
		return await this.fetch<
			Array<{
				t: string
				permission: StudioPermission
				dependsOn?: Array<StudioPermission>
			}>
		>({
			method: 'get',
			URL: '/api/studios/permissions',
		})
	}

	async getPermissionsInStudio(idStudio: number) {
		return await this.fetch<{
			permissions: Array<StudioPermission>
			isOwner: boolean
		}>({
			method: 'get',
			URL: `/api/studios/${idStudio}/my_permissions`,
		})
	}

	async createStudio(studio: {
		name: string
		username: string
		description: string
		email: string
		phone?: string
		address: string
		avatar: null | File
		banner: null | File
	}) {
		try {
			throwIfFormHasError()
			const formData = new FormData()
			formData.set('name', studio.name)
			formData.set('username', studio.username)
			formData.set('description', studio.description)
			formData.set('email', studio.email)
			if (studio.phone) formData.set('phone', studio.phone)
			formData.set('address', studio.address)
			if (studio.avatar) formData.set('avatar', studio.avatar)
			if (studio.banner) formData.set('banner', studio.banner)

			await this.fetch({
				method: 'post',
				URL: '/api/studios',
				body: formData,
				blockConcurrentFetch: true,
			})

			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null
			this.addErrorToast(err)

			return false
		}
	}

	async join(idStudio: number, idUser: number, role: StudioRole) {
		try {
			await this.fetch({
				method: 'post',
				URL: `/api/studios/${idStudio}/join/${idUser}`,
				body: {
					roles: [role],
				},
			})

			return true
		} catch (err) {
			this.addErrorToast(err)

			return false
		}
	}

	async changeRoles(
		idStudio: number,
		idUser: number,
		roles: Array<StudioRole>,
	) {
		try {
			await this.fetch({
				method: 'patch',
				URL: `/api/studios/${idStudio}/user/${idUser}/roles`,
				body: {
					roles,
				},
			})

			return true
		} catch (err) {
			this.addErrorToast(err)

			return false
		}
	}

	async setPermissions(
		idStudio: number,
		idUser: number,
		permission: {
			permission: StudioPermission
			enabled: boolean
		},
	) {
		try {
			await this.fetch({
				method: 'patch',
				URL: `/api/studios/${idStudio}/user/${idUser}/permissions`,
				body: permission,
			})

			return true
		} catch (err) {
			this.addErrorToast(err)

			return false
		}
	}

	async updateStudio(
		studio: {
			name?: string
			description?: string
			email?: string
			phone?: string
			address?: string
			avatar?: null | File
			banner?: null | File
			addMedia?: Array<{
				type: string
				link: string
			}>
			removeMedia?: Array<number>
		},
		idStudio: number,
		namespace?: string,
	) {
		try {
			throwIfFormHasError(namespace)
			const formData = new FormData()
			if (studio.name) formData.set('name', studio.name)
			if (studio.description !== undefined)
				formData.set('description', studio.description)
			if (studio.email) formData.set('email', studio.email)
			if (studio.phone !== undefined) formData.set('phone', studio.phone)
			if (studio.address) formData.set('address', studio.address)
			if (studio.avatar) formData.set('avatar', studio.avatar)
			if (studio.banner) formData.set('banner', studio.banner)
			studio.addMedia?.forEach((media) => {
				formData.append(`addMedia`, JSON.stringify(media))
			})
			studio.removeMedia?.forEach((media) => {
				formData.append(`removeMedia`, media.toString())
			})

			await this.fetch({
				method: 'patch',
				URL: `/api/studios/${idStudio}`,
				body: formData,
				blockConcurrentFetch: true,
			})

			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null
			this.addErrorToast(err)

			return false
		}
	}

	async removePerson(idStudio: number, idUser: number) {
		try {
			await this.fetch({
				method: 'delete',
				URL: `/api/studios/${idStudio}/user/${idUser}`,
			})

			return true
		} catch (err) {
			this.addErrorToast(err)

			return false
		}
	}
}
