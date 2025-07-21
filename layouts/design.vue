<template>
	<section class="Designs">
		<slot name="header" />
		<div class="Designs_content">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.Designs {
	max-width: 1400px;
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
</style>
