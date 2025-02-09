<template>
	<section class="Profile">
		<slot />
	</section>
</template>

<style scoped>
.Profile {
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	width: 100%;
	max-width: 1000px;
}
</style>
