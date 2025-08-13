<script lang="ts" setup>
import { UserTypesKeys } from '~/models/user/user.model'

// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: t('login.metadata.title'),
	description: t('login.metadata.description'),
	ogType: 'website',
	ogUrlPath: '/login',
})

useSeoMeta(seoMeta)
// Route
const toCalendar = useRoute().query['to-calendar']
const toStudio = useRoute().query.studio === 'true'
const forPlan = useRoute().query.forPlan
const idPlan = useRoute().query.idPlan
// Form
const login = reactive({
	email: '',
	password: '',
})

async function loginUser() {
	const username = await useNuxtApp().$authService.login(login)
	if (username) {
		if (forPlan && idPlan) {
			if (forPlan === 'user')
				useRouter().push(
					`/${username}/billing/subscription?subscribe=${idPlan}`,
				)
			else useRouter().push(`/${username}/studios?subscribe=${idPlan}`)
		} else if (toCalendar) {
			if (!toStudio) useRouter().push(`/${toCalendar}/calendar/new`)
			else useRouter().push(`/s/${toCalendar}/calendar/new`)
		} else if (useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST))
			useRouter().push(`/${username}`)
		else useRouter().push(`/${username}/config`)
	}
}
</script>

<template>
	<section class="Login">
		<div class="Login__content">
			<HTMLForm :action="loginUser">
				<template #title>
					<h3>{{ $t('login.login') }}</h3>
				</template>

				<HTMLInput
					id="email"
					v-model:value="login.email"
					type="email"
					:label="$t('register.form.email')"
					:validators="{
						required: true,
						email: true,
					}"
				/>
				<HTMLInput
					id="password"
					v-model:value="login.password"
					type="password"
					:label="$t('register.form.password')"
					:validators="{
						required: true,
						maxLength: 100,
						minLength: 6,
					}"
				/>
				<HTMLButton :with-background="true" type="submit">{{
					$t('login.form.button')
				}}</HTMLButton>
			</HTMLForm>
		</div>
	</section>
</template>

<style scoped lang="scss">
.Login {
	display: flex;
	justify-content: center;
}

.Login__content {
	width: 400px;
	padding: 15px;
	height: fit-content;
	border-radius: 10px;
	box-shadow: var(--box-shadow);
}
</style>
