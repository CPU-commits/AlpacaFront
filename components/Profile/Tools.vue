<script lang="ts" setup>
defineProps<{
	username: string
	isTattooArtist: boolean
}>()
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
	</section>
</template>

<style scoped>
.Calendar {
	display: flex;
	gap: 50px;
}
</style>
