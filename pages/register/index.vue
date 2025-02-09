<script lang="ts" setup>
import { PhBuildingOffice, PhUser } from '@phosphor-icons/vue'

// i18n
const { t } = useI18n()
// Form
const register = reactive({
	email: '',
	password: '',
	name: '',
	username: '',
	role: 'user',
})

async function registerUser() {
	const username = await useNuxtApp().$authService.register(register)
	if (username) {
		useRouter().push(`/${username}`)
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
					}"
				/>

				<HTMLHorizontalSelect
					v-model:checked="register.role"
					:items="[
						{
							name: $t('register.form.client'),
							value: 'user',
							icon: PhUser,
						},
						{
							name: $t('register.form.tattoArtist'),
							value: 'tattooArtist',
							icon: PhBuildingOffice,
						},
					]"
				/>
				<HTMLButton :with-background="true" type="submit">{{
					$t('register.form.register')
				}}</HTMLButton>
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
