<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})
// Meta
useSeoMeta(seoMetaNoIndex())

const subscribe = useRoute().query.subscribe
const { data: studios, error } = await useAsyncData(async (app) => {
	return await app?.$studioService.getStudios()
})
</script>

<template>
	<NuxtLayout name="panel">
		<ErrorWrapper :errors="[error]">
			<section class="Studios">
				<StudioCard
					v-for="studio in studios"
					:key="studio.id"
					:studio="studio"
					:to-subscribe="
						typeof subscribe === 'string' ? subscribe : undefined
					"
				/>
			</section>

			<div v-if="studios && studios.length === 0" class="Empty">
				<Illustration
					illustration="studios"
					:margin-top="false"
					:text="$t('studio.empty')"
				/>
				<div class="Empty__Actions">
					<HTMLAnchorButton to="studios/new" primary>
						{{ $t('studio.create') }}
					</HTMLAnchorButton>
				</div>
			</div>
		</ErrorWrapper>
	</NuxtLayout>
</template>

<style scoped>
img {
	width: 100px;
}

.Empty {
	display: flex;
	gap: 20px;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.Empty__Actions {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.Studios {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>
