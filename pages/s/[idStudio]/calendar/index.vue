<script lang="ts" setup>
import { SHOW_PEOPLE_PERMISSION } from '~/models/studio/permission.model'
import { UserTypesKeys } from '~/models/user/user.model'

const idStudio = parseInt(useRoute().params.idStudio as string)
// Data
const { data: countPendingAppointments } = useAsyncData(
	async (app) => {
		return await app?.$appointmentService.getCountPendingAppointments({
			idStudio,
		})
	},
	{
		server: false,
		immediate: useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST),
	},
)
const { data } = useAsyncData(
	async (app) => {
		return await app?.$studioService.getStudioTattooArtists(idStudio)
	},
	{
		server: false,
		immediate: useStudioPermissionsStore().userHasPermission(
			SHOW_PEOPLE_PERMISSION,
		),
	},
)
const tattooArtists = computed(() => data.value)

const pending = ref(0)
watch(countPendingAppointments, (count) => {
	if (count) pending.value = count
})
</script>

<template>
	<NuxtLayout name="studio">
		<AppointmentManager
			v-model:count-pending="pending"
			:id-studio="idStudio"
			:tattoo-artists="tattooArtists ?? undefined"
		/>
	</NuxtLayout>
</template>
