<script lang="ts" setup>
defineProps<{
	username: string
	isTattooArtist: boolean
}>()

const route = useRoute()
</script>

<template>
	<section class="Calendar">
		<HTMLSimpleAnchor
			v-if="useAuthStore().isOwnProfile"
			:to="`${username}/calendar`"
		>
			<i class="fa-solid fa-calendar-days"></i>
		</HTMLSimpleAnchor>
		<HTMLSimpleAnchor
			v-if="!useAuthStore().isOwnProfile && isTattooArtist"
			:to="`${username}/calendar/new`"
		>
			<i class="fa-solid fa-calendar-plus"></i>
			{{ $t('calendar.add') }}
		</HTMLSimpleAnchor>
		<HTMLSimpleAnchor
			v-if="useAuthStore().isOwnProfile"
			:to="`${username}/config`"
		>
			<i class="fa-solid fa-gear"></i>
		</HTMLSimpleAnchor>
		<HTMLSimpleAnchor
			v-if="route.path != `/${username}/designs`"
			:to="`${username}/designs`"
		>
			<i class="fa-solid fa-gear"></i>
		</HTMLSimpleAnchor>
	</section>
</template>

<style scoped>
.Calendar {
	display: flex;
	gap: 25px;
}
</style>
