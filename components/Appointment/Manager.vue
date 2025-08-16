<script lang="ts" setup>
import type { Appointment } from '~/models/appointment/appointment.model'
import { ASSIGN_TATTOO_ARTIST_PERMISSION } from '~/models/studio/permission.model'
import type { StudioPerson } from '~/models/studio/person.model'
import { UserTypesKeys } from '~/models/user/user.model'

const { countPending: countPendingAppointments, idStudio } = defineProps<{
	countPending: number
	idStudio?: number
	tattooArtists?: Array<StudioPerson>
}>()

const emit = defineEmits<{
	(e: 'update:countPending', v: number): void
}>()
// i18n
const { t } = useI18n()
// Form
const mode = ref(useAuthStore().userRoleNotIs(UserTypesKeys.TATTOO_ARTIST))

const page = ref(0)
const range = ref({
	from: startWeekDateRFC3339(),
	to: endWeekDateRFC3339(),
})
const idTattooArtistAssigned = ref(0)
// Data
const { data, refresh, error } = useAsyncData(
	async (app) => {
		return await app?.$appointmentService.getAppointments({
			page: page.value,
			idStudio,
			allAppointments:
				useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST) &&
				!useStudioPermissionsStore().isOwner,
		})
	},
	{ watch: [page], server: false },
)
const {
	data: dataCalendar,
	refresh: refreshCalendar,
	error: errCalendar,
} = useAsyncData(
	async (app) => {
		return await app?.$appointmentService.getAppointments({
			paginated: false,
			statuses: ['scheduled', 'reviewed'],
			...range.value,
			idStudio,
		})
	},
	{
		watch: [page, range],
		server: false,
		immediate:
			useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST) ||
			idStudio !== undefined,
	},
)
const appointments = computed(() => data.value?.appointments)
const total = computed(() => data.value?.total)
provide('total', total)
// Modals
const modalSchedule = ref(false)
const modalCancel = ref(false)
const modalEvent = ref(false)
const modalAssign = ref(false)
// Forma
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
		emit('update:countPending', countPendingAppointments - 1)
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
		emit('update:countPending', countPendingAppointments - 1)
		refreshCalendar()
	}
}

async function reviewAppointment(review: {
	idAppointment: number
	stars: number
	review: string
}) {
	if (review.stars === 0) {
		useToastsStore().addToast({
			message: t('calendar.reviewForm.starsRequiered'),
			type: 'error',
		})
		return
	}

	const success = await useNuxtApp().$appointmentService.reviewAppointment(
		review.idAppointment,
		{ stars: review.stars, review: review.review },
	)
	if (success) {
		refresh()
		useToastsStore().addToast({
			message: t('calendar.reviewForm.success'),
			type: 'success',
		})
	}
}

async function assignTattooArtist() {
	const success = await useNuxtApp().$appointmentService.assignTattooArtist(
		idAppointment.value,
		idTattooArtistAssigned.value,
	)
	if (success) {
		refresh()
		useToastsStore().addToast({
			message: t('calendar.assigned'),
			type: 'success',
		})
		modalAssign.value = false
	}
}
</script>

<template>
	<ErrorWrapper :errors="[error, errCalendar]">
		<div class="Container">
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
				v-if="
					useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST) ||
					useStudioPermissionsStore().isAdmin
				"
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
					:can-assign="
						tattooArtists &&
						tattooArtists.length > 0 &&
						useStudioPermissionsStore().userHasPermission(
							ASSIGN_TATTOO_ARTIST_PERMISSION,
						)
					"
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
					@review="reviewAppointment"
					@assign-tattoo-artist="
						(idAppointmentSchedule) => {
							idAppointment = idAppointmentSchedule
							modalAssign = true
						}
					"
				/>

				<Empty
					v-if="appointments && appointments.length === 0"
					:text="$t('calendar.noAppointments')"
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
				<AppointmentCard
					v-if="appointmentEvent"
					:appointment="appointmentEvent"
					:hover-box-shadow="false"
					@schedule="
						(idAppointmentSchedule) => {
							idAppointment = idAppointmentSchedule
							modalSchedule = true
							modalEvent = false
							schedule.scheduleAt = ''
							schedule.finishedAt = ''
						}
					"
					@cancel="
						(idAppointmentSchedule) => {
							idAppointment = idAppointmentSchedule
							modalCancel = true
							modalEvent = false
						}
					"
					@review="reviewAppointment"
					@assign-tattoo-artist="
						(idAppointmentSchedule) => {
							idAppointment = idAppointmentSchedule
							modalAssign = true
							modalEvent = false
						}
					"
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
			<Modal v-model:opened="modalAssign">
				<template #title>
					<h2>{{ $t('calendar.assignTattooArtist') }}</h2>
				</template>
				<HTMLForm :action="assignTattooArtist">
					<SelectAvatar
						id="tattooArtist"
						:label="$t('calendar.form.selectTattooArtist')"
						:users="
							tattooArtists?.map((user) => ({
								name: user.user.name,
								email: user.user.email,
								id: user.idUser,
								retrieveAvatar: user.idUser,
							})) ?? []
						"
						:validators="{
							required: true,
							namespace: 'assign',
						}"
						:can-select-recommend="false"
						@update:user="
							(user) => {
								if (user) idTattooArtistAssigned = user.id
							}
						"
					/>

					<HTMLButton type="submit">
						{{ $t('calendar.assign') }}
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
		</div>
	</ErrorWrapper>
</template>

<style lang="scss">
.Container {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

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
