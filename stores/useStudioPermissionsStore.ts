import { defineStore } from 'pinia'
import type { StudioPermission } from '~/models/studio/permission.model'

const useStudioPermissionsStore = defineStore('studioPermissions', {
	state: () => ({
		studios: new Map<number, Array<StudioPermission>>(),
		isOwner: false,
	}),
	getters: {
		isAdmin(state) {
			const idStudio = parseInt(useRoute().params.idStudio as string)
			if (!idStudio) return false

			return state.studios.has(idStudio)
		},
	},
	actions: {
		setStudioPermissions(
			idStudio: number,
			permissions: Array<StudioPermission>,
			isOwner: boolean,
		) {
			this.studios.set(idStudio, permissions)
			this.isOwner = isOwner
		},
		existsPermissions(idStudio: number) {
			return this.studios.has(idStudio)
		},
		userHasPermission(...permissions: Array<StudioPermission>) {
			const idStudio = parseInt(useRoute().params.idStudio as string)
			if (!idStudio) return false
			const studio = this.studios.get(idStudio)
			if (!studio) return false

			return permissions.every((permission) =>
				studio.some((p) => p === permission),
			)
		},
	},
})

export default useStudioPermissionsStore
