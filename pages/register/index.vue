<script lang="ts" setup>
import { UserTypesKeys } from '~/models/user/user.model'

// i18n
const { t } = useI18n()
// Route
const toCalendar = useRoute().query['to-calendar']
const toStudio = useRoute().query.studio === 'true'
// Form
const register = reactive({
	email: '',
	password: '',
	name: '',
	username: '',
})

async function registerUser() {
	const username = await useNuxtApp().$authService.register(register)
	if (username) {
		if (toCalendar) {
			if (!toStudio) useRouter().push(`/${toCalendar}/calendar/new`)
			else useRouter().push(`/s/${toCalendar}/calendar/new`)
		} else if (useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST))
			useRouter().push(`/${username}`)
		else useRouter().push(`/${username}/config`)

		useToastsStore().addToast({
			message: t('register.form.success'),
			type: 'success',
		})
	}
}
</script>

<template>
	<section class="Register">
		<div class="Register__content">
			<HTMLForm :action="registerUser">
				<template #title>
					<h3>{{ $t('register.register') }}</h3>
				</template>

				<HTMLInput
					id="name"
					v-model:value="register.name"
					:label="$t('register.form.name')"
					:validators="{
						required: true,
						maxLength: 100,
					}"
				/>
				<HTMLInput
					id="email"
					v-model:value="register.email"
					type="email"
					:label="$t('register.form.email')"
					:validators="{
						required: true,
						email: true,
					}"
				/>
				<HTMLInput
					id="password"
					v-model:value="register.password"
					type="password"
					:label="$t('register.form.password')"
					:validators="{
						required: true,
						maxLength: 100,
						minLength: 6,
					}"
				/>
				<HTMLInput
					id="username"
					v-model:value="register.username"
					:label="$t('register.form.username')"
					:validators="{
						required: true,
						maxLength: 100,
						regex: [
							{
								rule: /^(?=.*[a-z])[a-z0-9._]+$/,
								message: $t('common.username.bad'),
								match: false,
							},
							{
								rule: /\s/,
								message: $t('common.username.spaces'),
								match: true,
							},
							{
								rule: /[^a-z0-9._]/,
								message: $t('common.username.letter'),
								match: true,
							},
							{
								rule: /[A-Z]/,
								message: $t('common.username.upper'),
								match: true,
							},
							{
								rule: /[a-z]/,
								message: $t('common.username.min'),
								match: false,
							},
						],
					}"
				/>

				<HTMLButton :with-background="true" type="submit">{{
					$t('register.form.register')
				}}</HTMLButton>
				<footer class="Links">
					<HTMLSimpleAnchor
						:to="`/login${toCalendar ? `?to-calendar=${toCalendar}` : ''}${$route.query.studio && toCalendar ? `&studio=${$route.query.studio}` : ''}`"
					>
						{{ $t('register.hasAccount') }}
					</HTMLSimpleAnchor>
				</footer>
			</HTMLForm>
		</div>
	</section>
</template>

<style scoped lang="scss">
.Register {
	display: flex;
	justify-content: center;
}

img {
	max-width: 500px;
	filter: grayscale(1);
}

.Register__content {
	width: 400px;
	padding: 15px;
	height: fit-content;
	border-radius: 10px;
	box-shadow: var(--box-shadow);
}

.Roles {
	display: flex;
	justify-content: space-evenly;
}

.Role {
	padding: 10px;
	border: none;
	border-radius: 4px;
	i,
	small {
		color: var(--color-dark);
	}
	display: flex;
	flex-direction: column;
	align-items: center;
}

.Selected {
	background-color: var(--color-main);
	i,
	small {
		color: white;
	}
}

.Links {
	display: flex;
	justify-content: center;
}
</style>
