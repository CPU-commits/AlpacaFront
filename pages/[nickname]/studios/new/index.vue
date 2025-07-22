<script lang="ts" setup>
const { t } = useI18n()

definePageMeta({
	auth: true,
	middleware: 'owner',
})
// Form
const studio = reactive({
	name: '',
	username: '',
	description: '',
	email: '',
	phone: '',
	address: '',
	avatar: null as null | File,
	banner: null as null | File,
})

async function createStudio() {
	const success = await useNuxtApp().$studioService.createStudio({
		...studio,
		phone: studio.phone != '' ? studio.phone : undefined,
	})
	if (success) {
		useRouter().push(`/${useAuthStore().getUsername}/studios`)
		useToastsStore().addToast({
			message: t('studio.form.success'),
			type: 'success',
		})
	}
}
</script>

<template>
	<MinimalForm :action="createStudio">
		<template #title>
			<h3>
				{{ $t('studio.form.title') }}
			</h3>
		</template>
		<span>{{ $t('studio.form.logo') }}</span>
		<ProfileChangeAvatar :action="(file) => (studio.avatar = file)" />
		<HTMLInput
			id="name"
			v-model:value="studio.name"
			:label="$t('studio.form.name')"
			:validators="{ required: true, maxLength: 100 }"
		/>
		<HTMLInput
			id="username"
			v-model:value="studio.username"
			:label="$t('studio.form.username')"
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
		<HTMLTextArea
			id="description"
			v-model:value="studio.description"
			:label="$t('studio.form.description')"
			:validators="{ maxLength: 500 }"
		/>
		<HTMLInput
			id="email"
			v-model:value="studio.email"
			type="email"
			:label="$t('studio.form.email')"
			:validators="{ required: true, email: true }"
		/>
		<HTMLInput
			id="phone"
			v-model:value="studio.phone"
			:label="$t('studio.form.phone')"
			:validators="{ maxLength: 20 }"
		/>
		<HTMLInput
			id="address"
			v-model:value="studio.address"
			type="address"
			:label="$t('studio.form.address')"
			:validators="{ required: true, maxLength: 150 }"
		/>
		<HTMLInputImages
			id="avatar"
			:label="$t('studio.form.banner', { width: '920', height: '250' })"
			replace-image
			single
			:button="{
				icon: 'image',
			}"
			@update:images="
				(files) => {
					if (files && files.length > 0) studio.banner = files[0]
				}
			"
		/>

		<HTMLButton type="submit">
			{{ $t('studio.form.button') }}
		</HTMLButton>
	</MinimalForm>
</template>
