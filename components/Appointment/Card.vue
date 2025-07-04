<script lang="ts" setup>
import type { Appointment } from '~/models/appointment/appointment.model'
import { UserTypesKeys } from '~/models/user/user.model'

const { appointment, hoverBoxShadow = true } = defineProps<{
	appointment: Appointment
	hoverBoxShadow?: boolean
}>()

defineEmits<{
	(e: 'schedule' | 'cancel', idAppointment: number): void
}>()

const appointmentIsFinished = computed(
	() =>
		appointment.finishedAt &&
		dateIsAfter(new Date(), appointment.finishedAt),
)
</script>

<template>
	<article class="Appointment" :class="{ BoxShadow: hoverBoxShadow }">
		<div class="Appointment__Content">
			<header class="Appointment__Content--Header">
				<ProfileAvatar
					:avatar="
						appointment.userProfile?.avatar?.key ??
						appointment.tattooArtistProfile?.avatar?.key ??
						''
					"
				/>
				<div class="Appointment__Header--User">
					<span>
						<h3>
							{{
								appointment.user?.name ??
								appointment.tattooArtist?.name
							}}
						</h3>
						•
						{{ timeAgo(appointment.createdAt) }}
						<i
							v-if="appointment.status === 'created'"
							class="fa-solid fa-circle Pending"
						></i>
					</span>
					<span
						>@{{
							appointment.user?.username ??
							appointment.tattooArtist?.username
						}}</span
					>
					<span>
						{{
							appointment.user?.email ??
							appointment.tattooArtist?.email
						}}
						-
						{{ appointment.phone }}
					</span>
				</div>
			</header>
			<div class="Appointment__Content--Main">
				<p>{{ appointment.description }}</p>
				<div class="Appointment__Content--Idea">
					<div class="Item">
						<h4>{{ $t('calendar.area') }}</h4>
						<span v-if="appointment.area">{{
							$t(`calendar.areas.${appointment.area}`)
						}}</span>
						<span v-else>-</span>
					</div>
					<div class="Item">
						<h4>{{ $t('calendar.dimensions') }}</h4>
						<span v-if="appointment.width">
							{{ appointment.width }} x
							{{ appointment.height }} cm.
						</span>
						<span v-else>-</span>
					</div>
					<div class="Item">
						<h4>{{ $t('calendar.color') }}</h4>
						<span v-if="appointment.color">{{
							$t(`calendar.colors.${appointment.color}`)
						}}</span>
						<span v-else>-</span>
					</div>
				</div>
			</div>
			<footer class="Appointment__Content--Footer">
				<HTMLImages
					v-if="appointment.images"
					:images="appointment.images.map(({ key }) => key)"
					:from-provider="true"
					contain
				/>

				<div class="Appointment__Footer--Last">
					<div
						v-if="appointment.status !== 'canceled'"
						class="Appointment__Last--Buttons"
					>
						<HTMLButton
							v-if="
								useAuthStore().userRoleIs(
									UserTypesKeys.TATTOO_ARTIST,
								) &&
								(appointment.status === 'created' ||
									appointment.status === 'scheduled') &&
								!appointmentIsFinished
							"
							:click="() => $emit('schedule', appointment.id)"
							type="button"
						>
							<template v-if="appointment.status === 'created'">
								{{ $t('calendar.schedule') }}
							</template>
							<template v-else>
								{{ $t('calendar.reSchedule') }}
							</template>
						</HTMLButton>
						<HTMLButton
							v-if="!appointmentIsFinished"
							type="button"
							:without-background="true"
							:click="() => $emit('cancel', appointment.id)"
						>
							{{ $t('calendar.cancel') }}
						</HTMLButton>
					</div>
				</div>
			</footer>
		</div>
		<aside class="Appointment__Flag">
			<AppointmentLine
				:status="
					!appointmentIsFinished ? appointment.status : 'finished'
				"
				:created-at="appointment.createdAt"
				:scheduled-at="appointment.scheduledAt"
			/>
		</aside>
	</article>
</template>

<style scoped lang="scss">
.Appointment {
	display: flex;
	transition: all 0.4s ease;
	border-radius: 8px;
	width: 100%;
	max-width: 800px;
	flex-direction: column;
}

.BoxShadow:hover {
	box-shadow: var(--box-shadow);
}

.Pending {
	color: var(--color-main);
	font-size: 0.5rem;
}

.Appointment__Flag {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-width: 50px;
	padding: 20px;
	h4 {
		font-size: 1.6rem;
	}
	span {
		font-weight: bold;
		padding: 10px;
		text-align: center;
		font-size: 1.1rem;
	}
}

.Appointment__Content {
	padding: 10px;
	width: 100%;
}

.Appointment__Content--Header {
	display: flex;
	align-items: center;
	gap: 10px;
}

.Appointment__Header--User {
	display: flex;
	flex-direction: column;
	span {
		display: flex;
		align-items: center;
		gap: 5px;
	}
}

.Appointment__Content--Main {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

p {
	padding: 15px;
}

.Appointment__Content--Idea {
	border: 1px solid var(--color-light);
	padding: 20px;
	border-radius: 8px;
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
}

.Appointment__Content--Footer {
	margin-top: 20px;
	padding: 10px;
	border-top: 1px solid var(--color-light);
}

h5 {
	font-size: 1rem;
}

.Appointment__Footer--Last {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.Appointment__Last--Buttons {
	display: flex;
	gap: 10px;
	justify-content: center;
	width: 100%;
	button {
		width: fit-content;
	}
}
</style>
