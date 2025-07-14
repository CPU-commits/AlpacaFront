<script setup lang="ts">
import { any } from 'zod/v4'

//Stores
const authStore = useAuthStore()
// i18n
const { t } = useI18n()
// Router
const route = useRoute()
const nickname = route.params.nickname as string
//Data
const { data } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$profileService.getProfile(nickname)])
})
const profile = ref(data.value?.[0])
//Form
const formUserUpdate = reactive({
	name: '',
	phone: '',
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
	if (formUserUpdate.name === '' && formUserUpdate.phone === '') {
		useToastsStore().addToast({
			message: t('profile.form.error.invalidParams'),
			type: 'error',
		})
	}

	await useNuxtApp().$authService.updateUser(formUserUpdate)
	formUserUpdate.name = ''
	formUserUpdate.phone = ''
	useToastsStore().addToast({
		message: t('profile.form.success.confirmChange'),
		type: 'success',
	})
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
	<section class="Config">
		<section class="Config__avatar">
			<figure>
				<ProfileChangeAvatar :action="uploadProfileImg" />
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
					@update:value="updateProfile"
				/>
				<p v-else>{{ $t('profile.noDescription') }}</p>
			</div>
		</section>
		<section>
			<HTMLForm class="Config__form-A" :action="updateUser">
				<HTMLInput
					v-model:value="formUserUpdate.name"
					:placeholder="profile?.user.name ?? ''"
					:label="$t('profile.form.label.name')"
					type="text"
				/>
				<HTMLInput
					v-model:value="formUserUpdate.phone"
					:placeholder="profile?.user.phone ?? ''"
					:label="$t('profile.form.label.phone')"
					type="text"
				/>
				<template #footer
					><div class="ButtonContainer">
						<HTMLButton type="submit">
							{{ $t('profile.form.submit.save') }}
						</HTMLButton>
					</div></template
				>
			</HTMLForm>
			<div class="Config__form-B" :action="any">
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
										timerRecoveryFinished('recoveryEmail')
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
						{{ $t('profile.form.submit.requestPasswordChange') }}
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
			<h2>{{ $t('profile.modal.configModalTitle') }} {{ modalTitle }}</h2>
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
