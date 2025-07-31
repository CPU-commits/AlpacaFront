<script lang="ts" setup>
import {
	PhCalendarDots,
	PhChartBar,
	PhGear,
	PhHouse,
	PhUser,
} from '@phosphor-icons/vue'
import {
	SHOW_METRICS_PERMISSION,
	SHOW_PEOPLE_PERMISSION,
	UPDATE_STUDIO_PERMISSION,
} from '~/models/studio/permission.model'

const idStudio = useRoute().params.idStudio as string

await useAsyncData(async (app) => {
	if (useStudioPermissionsStore().existsPermissions(parseInt(idStudio)))
		return null

	const permissions = await app?.$studioService.getPermissionsInStudio(
		parseInt(idStudio),
	)
	if (!permissions) return null
	useStudioPermissionsStore().setStudioPermissions(
		parseInt(idStudio),
		permissions.permissions,
		permissions.isOwner,
	)
})

onMounted(async () => {
	const studio = await useNuxtApp().$studioService.getStudioUsername(
		parseInt(idStudio),
	)
	useUsername().value = studio.username
})

onBeforeUnmount(() => (useUsername().value = null))
</script>

<template>
	<section class="Studio">
		<nav v-if="useStudioPermissionsStore().isAdmin" class="Studio__Nav">
			<NuxtLink :to="`/s/${idStudio}`">
				<PhHouse :size="20" />
				{{ $t('studio.overview') }}
			</NuxtLink>
			<NuxtLink
				v-if="
					useStudioPermissionsStore().userHasPermission(
						SHOW_PEOPLE_PERMISSION,
					)
				"
				:to="`/s/${idStudio}/people`"
			>
				<PhUser :size="20" />
				{{ $t('studio.persons') }}
			</NuxtLink>
			<NuxtLink :to="`/s/${idStudio}/calendar`">
				<PhCalendarDots :size="20" />
				{{ $t('studio.calendar') }}
			</NuxtLink>
			<NuxtLink
				v-if="
					useStudioPermissionsStore().userHasPermission(
						SHOW_METRICS_PERMISSION,
					)
				"
				:to="`/s/${idStudio}/metrics`"
			>
				<PhChartBar :size="20" />
				{{ $t('studio.metrics') }}
			</NuxtLink>
			<NuxtLink
				v-if="
					useStudioPermissionsStore().userHasPermission(
						UPDATE_STUDIO_PERMISSION,
					)
				"
				:to="`/s/${idStudio}/config`"
			>
				<PhGear :size="20" />
				{{ $t('studio.config') }}
			</NuxtLink>
		</nav>
		<slot name="header" />

		<div class="Studio__Content">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.Studio {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 1000px;
}

.Studio__Nav {
	display: flex;
	width: 100%;
	padding: 10px 20px;
	border-bottom: 1px solid var(--color-light);
	gap: 20px;
}

.Studio__Content {
	padding: 20px;
	width: 100%;
}

a {
	display: flex;
	gap: 5px;
}
</style>
