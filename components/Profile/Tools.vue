<script lang="ts" setup>
defineProps<{
	username: string
}>()
</script>

<template>
	<section class="Calendar">
		<HTMLSimpleAnchor :to="`${username}/calendar`">
			<i class="fa-solid fa-calendar-days"></i>
		</HTMLSimpleAnchor>
	</section>
</template>
