<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})
</script>

<template>
	<NuxtLayout name="panel">
		<div class="ConfigContainer">
			<ProfileConfig />
		</div>
	</NuxtLayout>
</template>

<style scoped>
.ConfigContainer {
	width: 100%;
	display: flex;
	justify-content: center;
}
</style>
