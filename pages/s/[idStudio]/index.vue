<script lang="ts" setup>
import type { Publication } from '~/models/publication/publication.model'
import { PUBLISH_PERMISSION } from '~/models/studio/permission.model'

const idStudio = useRoute().params.idStudio as string

const { data } = await useAsyncData(async (app) => {
	return await Promise.all([
		app?.$studioService.getStudio(parseInt(idStudio)),
		app?.$tattooService.getLatestTattoos({
			idStudio: parseInt(idStudio),
		}),
	])
})
const studio = computed(() => data.value?.[0])
const tattoos = computed(() => data.value?.[1])
const publications = ref<Array<Publication>>([])

definePageMeta({
	pageTransition: {
		name: 'blur',
	},
})
</script>

<template>
	<NuxtLayout name="studio">
		<template #header>
			<header class="Banner">
				<StudioBanner :banner="studio?.banner?.key" />
			</header>
		</template>
		<div class="Header">
			<div class="Header__Left">
				<ProfileAvatar :avatar="studio?.avatar?.key" size="xl" />
				<div>
					<h1>{{ studio?.name }}</h1>
					<span>@{{ studio?.username }}</span>
				</div>
			</div>
			<div class="Header__Right">
				<span>{{ studio?.email }}</span>
				<span>{{ studio?.phone }}</span>
				<HTMLAnchorButton
					:to="`https://www.google.com/maps/search/?api=1&query=${studio?.fullAddress}`"
				>
					<i class="fa-solid fa-location-dot"></i>
					{{ studio?.fullAddress }}
				</HTMLAnchorButton>
			</div>
		</div>
		<div class="Brief">
			<ProfileCarousel
				:show-avatar="false"
				:nickname="studio?.id.toString() ?? ''"
				:tattoos="tattoos ?? []"
			/>
			<StudioMedia v-if="studio?.media" :media="studio?.media" />
		</div>
		<div class="Tools">
			<HTMLSimpleAnchor :to="`/s/${studio?.id}/calendar/new`" prefetch>
				<i class="fa-solid fa-calendar-plus"></i>
				{{ $t('calendar.add') }}
			</HTMLSimpleAnchor>
		</div>
		<p>{{ studio?.description }}</p>
		<section class="Posts__Container">
			<ProfilePublisher
				v-if="
					useStudioPermissionsStore().userHasPermission(
						PUBLISH_PERMISSION,
					)
				"
				:id-studio="parseInt(idStudio)"
				@upload-publication="
					(publication) => publications.unshift(publication)
				"
			/>

			<PublicationPublications
				v-model:publications="publications"
				:params="{ idStudio: parseInt(idStudio) }"
			/>
		</section>
	</NuxtLayout>
</template>

<style scoped lang="scss">
.Banner {
	width: 100%;
}

.Header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.Header__Left {
	display: flex;
	align-items: center;
	gap: 10px;
}

.Header__Right {
	text-align: right;
	display: flex;
	flex-direction: column;
	a {
		text-align: right;
		padding: 0;
		font-size: 1rem;
	}
}

.Brief {
	display: flex;
	flex-direction: column;
	padding: 15px;
	gap: 10px;
}

.Tools {
	display: flex;
	justify-content: center;
	padding: 10px;
}

p {
	padding: 10px;
}
</style>
