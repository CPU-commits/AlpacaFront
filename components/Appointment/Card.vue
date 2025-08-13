<script lang="ts" setup>
import type { Appointment } from '~/models/appointment/appointment.model'
import {
	CANCEL_APPOINTMENT_PERMISSION,
	SCHEDULE_APPOINTMENT_PERMISSION,
} from '~/models/studio/permission.model'
import { UserTypesKeys } from '~/models/user/user.model'

const { appointment, hoverBoxShadow = true } = defineProps<{
	appointment: Appointment
	hoverBoxShadow?: boolean
	canAssign?: boolean
}>()
// Form
const review = reactive({
	stars: 0,
	review: '',
})

const modalImg = ref(false)
defineEmits<{
	(
		e: 'schedule' | 'cancel' | 'assignTattooArtist',
		idAppointment: number,
	): void
	(
		e: 'review',
		data: { idAppointment: number; stars: number; review: string },
	): void
}>()

const iamTheTattoer = computed(
	() => appointment.idTattooArtist === useAuthStore().getID,
)
const userToShow = computed(() => {
	if (iamTheTattoer.value || useStudioPermissionsStore().isAdmin)
		return {
			user: appointment.user,
		}
	return {
		user: appointment.tattooArtist,
	}
})
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
								userToShow.user?.name ??
								$t('calendar.noTattooArtist')
							}}
						</h3>
						•
						{{ timeAgo(appointment.createdAt) }}
						<i
							v-if="appointment.status === 'created'"
							class="fa-solid fa-circle Pending"
						></i>
					</span>
					<span v-if="userToShow.user">
						@{{ userToShow.user?.username }}
					</span>
					<span>
						{{
							!userToShow.user
								? $t('calendar.searchingTatooArtist')
								: ''
						}}
						{{ userToShow.user?.email }}
						<template v-if="iamTheTattoer">
							-
							{{ appointment.phone }}
						</template>
					</span>
				</div>
			</header>
			<header
				v-if="
					appointment.tattooArtist &&
					useStudioPermissionsStore().isAdmin
				"
				class="Appointment__Content--Header AssignedTo"
			>
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
							{{ appointment.tattooArtist?.name }}
						</h3>
						•
						{{ $t('calendar.assignedTo') }}
					</span>
					<span> @{{ appointment.tattooArtist?.username }} </span>
					<span>
						{{ appointment.tattooArtist?.email }}
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
					<div class="Item">
						<h4>{{ $t('calendar.design') }}</h4>
						<span v-if="appointment.design?.image.key">
							<HTMLImg
								:image="appointment.design.image.key"
								:from-provider="true"
								contain="contain"
								size="s"
								@click="
									() => {
										modalImg = true
									}
								"
							/>
						</span>
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
								((useAuthStore().userRoleIs(
									UserTypesKeys.TATTOO_ARTIST,
								) &&
									iamTheTattoer) ||
									useStudioPermissionsStore().userHasPermission(
										SCHEDULE_APPOINTMENT_PERMISSION,
									)) &&
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
							v-if="
								!appointment.tattooArtist &&
								canAssign &&
								useStudioPermissionsStore().isAdmin
							"
							type="button"
							:click="
								() =>
									$emit('assignTattooArtist', appointment.id)
							"
						>
							{{ $t('calendar.assignTattooArtist') }}
						</HTMLButton>
						<HTMLButton
							v-if="
								!appointmentIsFinished &&
								(useStudioPermissionsStore().userHasPermission(
									CANCEL_APPOINTMENT_PERMISSION,
								) ||
									useAuthStore().getID ===
										appointment.idUser ||
									useAuthStore().getID ===
										appointment.idTattooArtist)
							"
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
					!appointmentIsFinished || appointment.status === 'reviewed'
						? appointment.status
						: 'finished'
				"
				:created-at="appointment.createdAt"
				:scheduled-at="appointment.scheduledAt"
			/>
			<HTMLForm
				v-if="
					appointment.status === 'finished' &&
					useAuthStore().getID === appointment.idUser
				"
				:action="
					() =>
						$emit('review', {
							idAppointment: appointment.id,
							...review,
						})
				"
				class="Appointment__Flag--Review"
			>
				<h3>
					<i class="fa-solid fa-ranking-star"></i>
					{{ $t('calendar.review') }}
				</h3>
				<div class="FormActions">
					<div class="Inputs">
						<HTMLStarRating v-model:stars="review.stars" />
						<HTMLTextArea
							:id="`review-${appointment.id}`"
							v-model:value="review.review"
							:validators="{
								required: true,
								maxLength: 250,
								namespace: `appointment-${appointment.id}`,
							}"
							:placeholder="$t('calendar.reviewForm.placeholder')"
						/>
					</div>
					<HTMLButton type="submit">
						{{ $t('calendar.reviewForm.button') }}
					</HTMLButton>
				</div>
			</HTMLForm>
			<div v-if="appointment.review" class="Review">
				<HTMLStarRating
					:stars="appointment.review.stars"
					stars-size="xl"
				/>
				<q>{{ appointment.review.review }}</q>
			</div>
		</aside>
		<ImageModal v-model:opened="modalImg">
			<HTMLImg
				v-if="appointment.design?.image.key"
				:image="appointment.design?.image.key"
				:from-provider="true"
				contain="contain"
				size="normal"
			/>
		</ImageModal>
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

.AssignedTo {
	border-top: 1px solid var(--color-light);
	margin-top: 10px;
	padding-top: 10px;
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

.Appointment__Flag--Review {
	display: flex;
	flex-direction: column;
	padding: 15px;
	width: 100%;
	h3 i {
		color: var(--color-main);
	}
}

.FormActions {
	display: flex;
	gap: 10px;
	.Inputs {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	align-items: center;
	button {
		height: fit-content;
		width: fit-content;
		padding: 10px 50px;
	}
}

.Review {
	padding: 20px;
	margin-top: 20px;
	border-top: 1px solid var(--color-light);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	i {
		font-size: 2rem;
	}
	q {
		font-size: 1rem;
	}
}

@media (max-width: 480px) {
	.Appointment__Content--Header {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
