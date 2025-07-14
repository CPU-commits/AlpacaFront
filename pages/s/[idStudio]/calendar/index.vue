<script lang="ts" setup>
import { UserTypesKeys } from '~/models/user/user.model'

// Data
const { data: countPendingAppointments } = useAsyncData(
	async (app) => {
		return await app?.$appointmentService.getCountPendingAppointments()
	},
	{
		server: false,
		immediate: useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST),
	},
)

const pending = ref(0)
watch(countPendingAppointments, (count) => {
	if (count) pending.value = count
})
</script>

<template>
	<NuxtLayout name="studio">
		<AppointmentManager v-model:count-pending="pending" />
	</NuxtLayout>
</template>
