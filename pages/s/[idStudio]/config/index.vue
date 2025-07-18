<script lang="ts" setup>
const idStudio = parseInt(useRoute().params.idStudio as string)
const { t } = useI18n()
// Modal
const modalMedia = ref(false)
// Form
const media = reactive({
	type: '',
	link: '',
})
// Data
const { data, refresh } = await useAsyncData(async (app) => {
	return await app?.$studioService.getStudio(idStudio)
})
const studio = ref({
	...data.value,
	description: data.value?.description ?? '',
	name: data.value?.name ?? '',
	phone: data.value?.phone ?? '',
	email: data.value?.email ?? '',
	address: data.value?.fullAddress ?? '',
	avatarFile: null as File | null,
	bannerFile: null as File | null,
	media: data.value?.media ?? [],
})

watch(data, (data) => {
	studio.value = {
		...data,
		description: data?.description ?? '',
		name: data?.name ?? '',
		phone: data?.phone ?? '',
		email: data?.email ?? '',
		address: data?.fullAddress ?? '',
		avatarFile: null as File | null,
		bannerFile: null as File | null,
		media: data?.media ?? [],
	}
})

async function updateBanner(banner: File) {
	await useNuxtApp().$studioService.updateStudio(
		{
			banner,
		},
		idStudio,
	)
}

async function updateAvatar(avatar: File) {
	await useNuxtApp().$studioService.updateStudio(
		{
			avatar,
		},
		idStudio,
	)
}

async function updateConfig() {
	const success = await useNuxtApp().$studioService.updateStudio(
		{
			...studio.value,
			avatar: null,
			banner: null,
		},
		idStudio,
	)
	if (success) {
		useToastsStore().addToast({
			message: t('studio.profile.success'),
			type: 'success',
		})
	}
}

async function addMedia() {
	studio.value.media.push({
		...media,
		id: 0,
		typeMedia: media.type,
	})

	const success = await useNuxtApp().$studioService.updateStudio(
		{
			avatar: null,
			banner: null,
			addMedia: [{ ...media }],
		},
		idStudio,
		'media',
	)
	if (success) {
		useToastsStore().addToast({
			message: t('studio.profile.success'),
			type: 'success',
		})
		media.link = ''
		media.type = ''
		modalMedia.value = false
		refresh()
	}
}

async function deleteMedia(idMedia: number) {
	studio.value.media = studio.value.media.filter(({ id }) => id !== idMedia)

	const success = await useNuxtApp().$studioService.updateStudio(
		{
			avatar: null,
			banner: null,
			removeMedia: [idMedia],
		},
		idStudio,
		'noMedia',
	)
	if (!success) {
		useToastsStore().addToast({
			message: t('studio.media.error'),
			type: 'error',
		})
	}
}
</script>

<template>
	<NuxtLayout name="studio">
		<StudioChangeBanner
			:banner="data?.banner?.key"
			:action="updateBanner"
		/>
		<br />
		<section class="Config__avatar">
			<figure>
				<ProfileChangeAvatar
					:avatar="data?.avatar?.key"
					:action="updateAvatar"
				/>
			</figure>
			<div class="Config__description">
				<HTMLTextArea
					id="description"
					v-model:value="studio.description"
					:placeholder="$t('studio.profile.noDescription')"
					:validators="{ maxLength: 500 }"
				/>
			</div>
		</section>
		<section>
			<HTMLForm class="Config__form-A" :action="updateConfig">
				<HTMLInput
					id="name"
					v-model:value="studio.name"
					:label="$t('studio.profile.name')"
					:validators="{ required: true, maxLength: 100 }"
				/>
				<HTMLInput
					id="email"
					v-model:value="studio.email"
					:label="$t('studio.profile.email')"
					:validators="{ required: true, email: true }"
				/>
				<HTMLInput
					id="phone"
					v-model:value="studio.phone"
					:label="$t('studio.profile.phone')"
					type="text"
					:validators="{ maxLength: 20 }"
				/>
				<HTMLInput
					id="email"
					v-model:value="studio.email"
					:label="$t('studio.profile.email')"
					:validators="{ required: true, email: true }"
				/>
				<HTMLInput
					id="address"
					v-model:value="studio.address"
					type="address"
					:label="$t('studio.profile.address')"
					:validators="{ required: true, maxLength: 150 }"
				/>

				<template #footer
					><div class="ButtonContainer">
						<HTMLButton type="submit">
							{{ $t('profile.form.submit.save') }}
						</HTMLButton>
					</div></template
				>
			</HTMLForm>
			<div class="Media">
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
						:media="studio.media"
						can-delete
						@delete="deleteMedia"
					/>
					<Empty
						v-if="studio && studio.media.length === 0"
						:text="$t('studio.media.addMedia')"
					/>
				</div>
			</div>
		</section>

		<Modal v-model:opened="modalMedia">
			<template #title>
				<h2>{{ $t('studio.profile.addMedia') }}</h2>
			</template>
			<HTMLForm :action="addMedia">
				<HTMLSelectWithIcons
					id="media"
					v-model:value="media.type"
					:label="$t('studio.profile.mediaType')"
					:options="[
						{
							text: 'WhatsApp',
							value: 'whatsapp',
							icon: 'fa-brands fa-whatsapp',
						},
						{
							icon: 'fa-solid fa-globe',
							text: 'Web',
							value: 'web',
						},
						{
							icon: 'fa-brands fa-square-x-twitter',
							text: 'X',
							value: 'x',
						},
						{
							icon: 'fa-brands fa-facebook',
							text: 'Facebook',
							value: 'facebook',
						},
						{
							icon: 'fa-brands fa-instagram',
							text: 'Instagram',
							value: 'instagram',
						},
					]"
					:validators="{
						required: true,
						namespace: 'media',
					}"
				/>
				<HTMLInput
					id="link"
					v-model:value="media.link"
					:label="$t('studio.profile.link')"
					:validators="{
						required: true,
						maxLength: 150,
						httpUrl: true,
						namespace: 'media',
					}"
				/>

				<span v-if="media.type === 'whatsapp'">
					{{ $t('studio.profile.suggestLink') }}
					<HTMLSimpleAnchor
						to="https://crear.wa.link/"
						rel="external"
						target="_blank"
					>
						https://crear.wa.link/
					</HTMLSimpleAnchor>
				</span>

				<HTMLButton type="submit">
					{{ $t('studio.profile.addSocialMedia') }}
				</HTMLButton>
			</HTMLForm>
		</Modal>
	</NuxtLayout>
</template>

<style scoped>
.ButtonContainer {
	display: flex;
	justify-content: end;
	button {
		width: 50%;
	}
}

.Config__form-A {
	gap: 20px;
}

.Config__avatar {
	display: flex;
	align-items: center;
	gap: 16px;
	.Config__description {
		width: 100%;
	}
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
</style>
