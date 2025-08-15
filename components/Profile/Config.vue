<script setup lang="ts">
import { UserTypesKeys } from '~/models/user/user.model'

//Stores
const authStore = useAuthStore()
// i18n
const { t } = useI18n()
// Router
const route = useRoute()
const nickname = route.params.nickname as string
//Data
const { data, refresh, error } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$profileService.getProfile(nickname)])
})
const profile = ref(data.value?.[0])
// Modal
const modalMedia = ref(false)
//Form
const formUserUpdate = reactive({
	name: '',
	phone: '',
	location: '',
})
type CountdownComponent = {
	startCountdown: () => void
}

const formNewPassword = ref<string>('')
const formNewEmail = ref<string>('')

const buttonCodeState = ref<boolean>(false)
const countdownRef = ref<CountdownComponent | null>(null)

const code = reactive({
	code: '',
	type: '',
})

const state = reactive({
	inputPassword: false,
	inputEmail: false,
})

type CodeType = 'recoveryEmail' | 'recoveryPassword'

const formType: Record<CodeType, string> = {
	recoveryEmail: t('profile.modal.changeEmail'),
	recoveryPassword: t('profile.modal.changePassword'),
}

const modalCode = ref(false)
const modalTitle = ref('')

let timer: NodeJS.Timeout | undefined

function updateProfile() {
	if (timer) clearTimeout(timer)

	timer = setTimeout(() => {
		useNuxtApp().$profileService.updateProfile({
			description: profile.value?.description ?? undefined,
		})
	}, 1000)
}

async function uploadProfileImg(file: File) {
	const key = await useNuxtApp().$profileService.changeAvatar(file)
	if (key && profile.value?.avatar) {
		profile.value.avatar.key = key.key
	}
}

async function updateUser() {
	if (
		formUserUpdate.name === '' &&
		formUserUpdate.phone === '' &&
		formUserUpdate.location === ''
	) {
		useToastsStore().addToast({
			message: t('profile.form.error.invalidParams'),
			type: 'error',
		})
		return
	}
	const newProfileData = {
		...formUserUpdate,
	}

	const success = await useNuxtApp().$authService.updateUser(
		formUserUpdate,
		'user',
	)
	if (success) {
		formUserUpdate.name = ''
		formUserUpdate.phone = ''
		formUserUpdate.location = ''
		if (newProfileData.location != '' && profile.value?.user)
			profile.value.user.location = newProfileData.location
		if (newProfileData.phone != '' && profile.value?.user)
			profile.value.user.phone = newProfileData.phone
		if (newProfileData.name != '' && profile.value?.user)
			profile.value.user.name = newProfileData.name

		useToastsStore().addToast({
			message: t('profile.form.success.confirmChange'),
			type: 'success',
		})
	}
}

async function updateMedia(addMedia: { type: string; link: string }) {
	const success = await useNuxtApp().$authService.updateUser(
		{
			addMedia: [{ ...addMedia }],
		},
		'media',
	)
	if (success) {
		useToastsStore().addToast({
			message: t('profile.form.success.confirmChange'),
			type: 'success',
		})
		refresh()
	}
}

async function deleteMedia(idMedia: number) {
	if (profile.value?.user)
		profile.value.user.media = profile.value?.user.media?.filter(
			({ id }) => id !== idMedia,
		)

	const success = await useNuxtApp().$authService.updateUser({
		removeMedia: [idMedia],
	})
	if (success) {
		refresh()
	}
}

async function generateCode(codeType: CodeType) {
	if (codeType in formType) {
		modalTitle.value = formType[codeType]
		code.type = codeType === 'recoveryEmail' ? 'email' : 'password'
	}

	await useNuxtApp().$codeService.generateCode({
		duration: 3,
		type: codeType,
		usesRemaining: 1,
	})
}

async function verifyCode() {
	if (code.code === '' || code.code.length < 6) {
		useToastsStore().addToast({
			message: t('profile.form.error.notEnoughCharacters'),
			type: 'error',
		})
	} else {
		const res = await useNuxtApp().$codeService.verifyCode(code.code, {
			type: code.type,
		})

		if (res) {
			modalCode.value = false
			if (code.type === 'email') {
				state.inputEmail = true
			} else {
				state.inputPassword = true
			}
		}
		code.code = ''
		code.type = ''
	}
}

async function updateEmail() {
	if (formNewEmail.value != '') {
		const res = await useNuxtApp().$authService.updateEmail({
			newEmail: formNewEmail.value,
		})
		if (res) {
			useToastsStore().addToast({
				message: t('profile.form.success.confirmChangeEmail'),
				type: 'success',
			})
			state.inputEmail = false
			formNewEmail.value = ''
		}
	} else {
		useToastsStore().addToast({
			message: t('profile.form.error.invalidEmail'),
			type: 'error',
		})
	}
}

async function updatePassword() {
	if (formNewPassword.value.length >= 6) {
		const res = await useNuxtApp().$authService.updatePassword({
			newPassword: formNewPassword.value,
		})
		if (res) {
			useToastsStore().addToast({
				message: t('profile.form.success.confirmChangePassword'),
				type: 'success',
			})
		}
		state.inputPassword = false
		formNewPassword.value = ''
	} else {
		useToastsStore().addToast({
			message: t('profile.form.error.notEnoughCharacters'),
			type: 'error',
		})
	}
}

async function timerRecoveryFinished(type: CodeType) {
	if (type in formType) {
		if (type == 'recoveryEmail') {
			state.inputEmail = false
		} else {
			state.inputPassword = false
		}
	}
}

async function timerCodeFinished() {
	buttonCodeState.value = false
}

async function startTimer() {
	countdownRef.value?.startCountdown()
}
</script>

<template>
	<ErrorWrapper :errors="[error]">
		<section class="Config">
			<section class="Config__avatar">
				<figure>
					<ProfileChangeAvatar
						:avatar="profile?.avatar?.key"
						:action="uploadProfileImg"
					/>
				</figure>
				<div class="Config__description">
					<p v-if="profile?.description && !authStore.isOwnProfile">
						{{ profile.description }}
					</p>
					<HTMLTextArea
						v-else-if="authStore.isOwnProfile && profile"
						id="description"
						v-model:value="profile.description"
						:placeholder="$t('profile.noDescription')"
						:validators="{
							maxLength: 500,
							namespace: 'description',
						}"
						@update:value="updateProfile"
					/>
					<p v-else>{{ $t('profile.noDescription') }}</p>
				</div>
			</section>
			<section>
				<HTMLForm class="Config__form-A" :action="updateUser">
					<HTMLInput
						id="name"
						v-model:value="formUserUpdate.name"
						:placeholder="profile?.user.name ?? ''"
						:label="$t('profile.form.label.name')"
						type="text"
						:validators="{
							maxLength: 100,
							namespace: 'user',
						}"
					/>
					<HTMLInput
						id="phone"
						v-model:value="formUserUpdate.phone"
						:placeholder="profile?.user.phone ?? ''"
						:label="$t('profile.form.label.phone')"
						:validators="{
							maxLength: 20,
							namespace: 'user',
						}"
						type="text"
					/>
					<HTMLInput
						v-if="
							useAuthStore().userRoleIs(
								UserTypesKeys.TATTOO_ARTIST,
							)
						"
						id="location"
						v-model:value="formUserUpdate.location"
						:placeholder="profile?.user.location ?? ''"
						:label="$t('profile.form.label.location')"
						type="text"
						:validators="{
							maxLength: 200,
							namespace: 'user',
						}"
					/>
					<ShareCalendar
						v-if="
							useAuthStore().userRoleIs(
								UserTypesKeys.TATTOO_ARTIST,
							)
						"
						:to="{
							username: nickname,
						}"
					/>
					<template #footer>
						<div class="ButtonContainer">
							<HTMLButton type="submit">
								{{ $t('profile.form.submit.save') }}
							</HTMLButton>
						</div>
					</template>
				</HTMLForm>
				<div
					v-if="
						useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)
					"
					class="Media"
				>
					<h3>
						<i class="fa-solid fa-globe"></i>
						{{ $t('studio.profile.media') }}
						<HTMLSimpleButton
							type="button"
							:click="() => (modalMedia = true)"
						>
							<i class="fa-solid fa-plus"></i>
						</HTMLSimpleButton>
					</h3>
					<div class="Medias">
						<StudioMedia
							:media="profile?.user?.media ?? []"
							can-delete
							@delete="deleteMedia"
						/>
						<Empty
							v-if="
								!profile?.user.media ||
								profile.user.media.length === 0
							"
							:text="$t('studio.media.addMedia')"
							:margin-top="false"
						/>
					</div>
				</div>
				<div class="Config__form-B">
					<div>
						<HTMLInput
							:value="profile?.user.email ?? ''"
							:label="$t('profile.form.label.email')"
							type="email"
							:disabled="true"
						/>
						<HTMLSimpleButton
							:click="
								() => {
									generateCode('recoveryEmail')
									modalCode = true
								}
							"
							type="button"
						>
							{{ $t('profile.form.submit.requestEmailChange') }}
						</HTMLSimpleButton>
						<HTMLForm
							v-if="state.inputEmail"
							class="Form-B"
							:header="false"
							:footer="false"
							:action="updateEmail"
						>
							<HTMLInput
								v-model:value="formNewEmail"
								type="email"
								:label="$t('profile.form.label.newEmail')"
							/>

							<div>
								<Timer
									:minutes="5"
									@finished="
										() => {
											timerRecoveryFinished(
												'recoveryEmail',
											)
										}
									"
								/>
								<HTMLButton type="submit">
									{{ $t('profile.form.submit.save') }}
								</HTMLButton>
							</div>
						</HTMLForm>
					</div>
					<div>
						<HTMLInput
							value="***********"
							:label="$t('profile.form.label.password')"
							type="password"
							:disabled="true"
						/>
						<HTMLSimpleButton
							:click="
								() => {
									generateCode('recoveryPassword')
									modalCode = true
								}
							"
							type="button"
						>
							{{
								$t('profile.form.submit.requestPasswordChange')
							}}
						</HTMLSimpleButton>
						<HTMLForm
							v-if="state.inputPassword"
							class="Form-B"
							:header="false"
							:action="updatePassword"
						>
							<HTMLInput
								v-model:value="formNewPassword"
								type="password"
								:label="$t('profile.form.label.newPassword')"
							/>

							<div>
								<Timer
									:minutes="5"
									@finished="
										() => {
											timerRecoveryFinished(
												'recoveryPassword',
											)
										}
									"
								/>
								<HTMLButton type="submit">
									{{ $t('profile.form.submit.save') }}
								</HTMLButton>
							</div>
						</HTMLForm>
					</div>
				</div>
			</section>
		</section>
		<Modal
			v-model:opened="modalCode"
			class="Modal"
			@update:close="timerCodeFinished"
		>
			<template #title>
				<h2>
					{{ $t('profile.modal.configModalTitle') }} {{ modalTitle }}
				</h2>
			</template>
			<p>
				{{ $t('profile.form.title.verifyCode') }}
			</p>
			<div class="Modal__form">
				<HTMLForm :action="verifyCode">
					<template #title>
						<div class="Modal__form-title">
							<Timer
								v-if="buttonCodeState"
								ref="countdownRef"
								:minutes="1.5"
								@finished="timerCodeFinished"
							/>
							<HTMLButton
								type="button"
								:disabled="buttonCodeState"
								:click="
									() => {
										startTimer()
										buttonCodeState = true
									}
								"
								>{{
									$t('profile.form.submit.generateNewCode')
								}}</HTMLButton
							>
						</div>
					</template>
					<HTMLOtpInput v-model:value="code.code" />
					<template #footer>
						<HTMLButton type="submit">
							{{ $t('profile.form.submit.verifyCode') }}
						</HTMLButton>
					</template>
				</HTMLForm>
			</div>
		</Modal>
		<MediaAddModal
			v-model:modal-media="modalMedia"
			@push-media="
				(media) => {
					if (profile?.user?.media) profile.user?.media?.push(media)
					else if (profile?.user && !profile.user.media)
						profile.user.media = [media]
				}
			"
			@update-media="updateMedia"
		/>
	</ErrorWrapper>
</template>

<style scoped>
.ButtonContainer {
	display: flex;
	justify-content: end;
	button {
		width: 50%;
	}
}
.Config {
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	gap: 28px;
}
.Config__form-A {
	gap: 20px;
}
.Config__form-B {
	display: flex;
	padding: 16px 0;
	flex-direction: column;
	justify-content: space-between;
	border-top: 1px solid var(--color-light);

	gap: 24px;

	button {
		margin-top: 4px;
		padding: 0 0 0 4px;
		text-decoration: underline;
	}
}
.Config__avatar {
	display: flex;
	align-items: center;
	gap: 16px;
	.Config__description {
		width: 100%;
	}
}

.Modal {
	display: flex;
	align-items: center;
	.Modal__form {
		width: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		form {
			padding: 16px 0;
			gap: 16px;
		}
	}
	p {
		text-align: center;
	}
}

.Media {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding-bottom: 20px;
}

.Medias {
	display: flex;
	justify-content: center;
}

.Media h3 {
	display: flex;
	gap: 5px;
	align-items: center;
}

.Form-B {
	padding-top: 16px;
	button {
		margin: 0;
		padding: 6px;
		text-decoration: none;
	}
	div:last-of-type {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		button {
			width: 50%;
		}
	}
}
.Modal__form-title {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	padding-bottom: 8px;
	button {
		width: 50%;
	}
}
</style>
