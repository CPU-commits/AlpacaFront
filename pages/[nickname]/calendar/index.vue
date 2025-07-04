<script lang="ts" setup>
import type { Appointment } from '~/models/appointment/appointment.model'
import { UserTypesKeys } from '~/models/user/user.model'

// i18n
const { t } = useI18n()
// Form
const mode = ref(useAuthStore().userRoleNotIs(UserTypesKeys.TATTOO_ARTIST))

const page = ref(0)
const range = ref({
	from: startWeekDateRFC3339(),
	to: endWeekDateRFC3339(),
})
// Data
const { data: countPendingAppointments, refresh: refreshPending } =
	useAsyncData(
		async (app) => {
			return await app?.$appointmentService.getCountPendingAppointments()
		},
		{ server: false },
	)
const { data, refresh } = useAsyncData(
	async (app) => {
		return await app?.$appointmentService.getAppointments({
			page: page.value,
		})
	},
	{ watch: [page], server: false },
)
const { data: dataCalendar, refresh: refreshCalendar } = await useAsyncData(
	async (app) => {
		return await app?.$appointmentService.getAppointments({
			paginated: false,
			statuses: ['scheduled', 'paid'],
			...range.value,
		})
	},
	{ watch: [page, range], server: false },
)
const appointments = computed(() => data.value?.appointments)
const total = computed(() => data.value?.total)
provide('total', total)
// Modals
const modalSchedule = ref(false)
const modalCancel = ref(false)
const modalEvent = ref(false)
// Form
const idAppointment = ref(0)
const schedule = reactive({
	scheduleAt: '',
	finishedAt: '',
})
const appointmentEvent = ref<Appointment | null>(null)

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
		refreshPending()
		refreshCalendar()
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
		refreshPending()
		refreshCalendar()
	}
}
</script>

<template>
	<NuxtLayout name="panel">
		<menu
			v-if="useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)"
			class="Menu"
		>
			<div class="Menu__Switch">
				<i class="fa-solid fa-calendar-week"></i>
				<HTMLSwitch id="toggle" v-model:checked="mode" label="" />
				<div class="Menu__Switch--Cards">
					<i class="fa-solid fa-square-full"></i>
					<aside v-if="countPendingAppointments">
						{{ countPendingAppointments }}
					</aside>
				</div>
			</div>
		</menu>
		<ClientOnly
			v-if="useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)"
		>
			<AppointmentCalendar
				v-show="!mode"
				:appointments="dataCalendar?.appointments ?? []"
				@show-event="
					(a) => {
						appointmentEvent = a
						modalEvent = true
					}
				"
				@update:range="
					(newRange) => {
						range = {
							to: dateToRFC3339(newRange.end),
							from: dateToRFC3339(newRange.start),
						}
					}
				"
			/>
		</ClientOnly>
		<section v-if="mode" class="Appointments">
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
			v-if="mode && data"
			:navigate="{
				activate: true,
				max: data?.perPage ?? 1,
				fn: (n) => {
					page = n
				},
			}"
		/>
		<!-- Modals -->
		<Modal v-model:opened="modalEvent" :show-header="false">
			<template #title>
				<h2>evento</h2>
			</template>
			<AppointmentCard
				v-if="appointmentEvent"
				:appointment="appointmentEvent"
				:hover-box-shadow="false"
			/>
		</Modal>
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
	gap: 20px;
	align-items: center;
}

.Menu__Switch {
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
	gap: 10px;
	i {
		font-size: 1.1rem;
	}
}

.Menu__Switch--Cards {
	position: relative;
}

.Menu__Switch aside {
	position: absolute;
	right: -10px;
	bottom: -5px;
	background-color: var(--color-main);
	border-radius: 100%;
	width: 15px;
	height: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--color-with-main);
	font-size: 0.9rem;
}
</style>
