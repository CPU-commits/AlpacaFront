<script lang="ts" setup>
const page = ref(0)

const { data } = await useAsyncData(async (app) => {
	return await app?.$appointmentService.getAppointments({
		page: page.value,
	})
})
const appointments = computed(() => data.value?.appointments)
</script>

<template>
	<NuxtLayout name="panel">
		<h2>Citas</h2>

		<AppointmentCard
			v-for="appointment in appointments"
			:key="appointment.id"
			:appointment="appointment"
		/>
	</NuxtLayout>
</template>

<style lang="scss">
h2 {
	text-align: center;
}
</style>
