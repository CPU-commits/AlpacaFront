<script lang="ts" setup>
// i18n
const { t } = useI18n()

const page = ref(0)

const { data, refresh } = await useAsyncData(
	async (app) => {
		return await app?.$appointmentService.getAppointments({
			page: page.value,
		})
	},
	{ watch: [page] },
)
const appointments = computed(() => data.value?.appointments)
const total = computed(() => data.value?.total)
provide('total', total)
// Modals
const modalSchedule = ref(false)
const modalCancel = ref(false)
// Form
const idAppointment = ref(0)
const schedule = reactive({
	scheduleAt: '',
	finishedAt: '',
})

async function scheduleAppointment() {
	const success = await useNuxtApp().$appointmentService.scheduleAppointment(
		{
			scheduledAt: schedule.scheduleAt,
			finishedAt:
				schedule.finishedAt !== '' ? schedule.finishedAt : undefined,
		},
		idAppointment.value,
	)
	if (success) {
		useToastsStore().addToast({
			message: t('calendar.successScheduled'),
			type: 'success',
		})
		modalSchedule.value = false
		refresh()
	}
}

async function cancelAppointment() {
	const success = await useNuxtApp().$appointmentService.cancelAppointment(
		idAppointment.value,
	)
	if (success) {
		useToastsStore().addToast({
			message: t('calendar.successCanceled'),
			type: 'success',
		})
		modalCancel.value = false
		refresh()
	}
}
</script>

<template>
	<NuxtLayout name="panel">
		<section class="Appointments">
			<AppointmentCard
				v-for="appointment in appointments"
				:key="appointment.id"
				:appointment="appointment"
				@schedule="
					(idAppointmentSchedule) => {
						idAppointment = idAppointmentSchedule
						modalSchedule = true
						schedule.scheduleAt = ''
						schedule.finishedAt = ''
					}
				"
				@cancel="
					(idAppointmentSchedule) => {
						idAppointment = idAppointmentSchedule
						modalCancel = true
					}
				"
			/>
		</section>
		<HTMLNav
			:navigate="{
				activate: true,
				max: data?.perPage ?? 1,
				fn: (n) => {
					page = n
				},
			}"
		/>
		<!-- Modals -->
		<Modal v-model:opened="modalSchedule">
			<template #title>
				<h2>{{ $t('calendar.schedule') }}</h2>
			</template>
			<HTMLForm :action="scheduleAppointment">
				<HTMLInput
					id="scheduledAt"
					v-model:value="schedule.scheduleAt"
					:label="$t('calendar.scheduledAt')"
					type="datetime-local"
					:validators="{
						required: true,
					}"
				/>
				<HTMLInput
					id="finishedAt"
					v-model:value="schedule.finishedAt"
					:label="$t('calendar.finishedAt')"
					type="time"
				/>
				<span>{{ $t('calendar.finishedAtOpcional') }}</span>

				<HTMLButton type="submit">
					{{ $t('calendar.confirmSchedule') }}
				</HTMLButton>
			</HTMLForm>
		</Modal>
		<Modal v-model:opened="modalCancel">
			<template #title>
				<h2>{{ $t('calendar.cancel') }}</h2>
			</template>
			<HTMLForm :action="cancelAppointment">
				<HTMLDanger :text="$t('calendar.dangerCancel')" />

				<HTMLButton type="submit">
					{{ $t('calendar.confirmCancel') }}
				</HTMLButton>
			</HTMLForm>
		</Modal>
	</NuxtLayout>
</template>

<style lang="scss">
h2 {
	text-align: center;
}

.Appointments {
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
}
</style>
