<script lang="ts" setup>
// Route
const toCalendar = useRoute().query['to-calendar']
// Form
const login = reactive({
	email: '',
	password: '',
})

async function loginUser() {
	const username = await useNuxtApp().$authService.login(login)
	if (username) {
		if (toCalendar) useRouter().push(`/${toCalendar}/calendar/new`)
		else useRouter().push(`/${username}`)
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
