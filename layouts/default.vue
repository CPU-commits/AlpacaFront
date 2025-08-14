<script setup lang="ts">
import Toasts from '~~/components/Toast/Toasts.vue'
const spinner = useSpinner()
</script>

<template>
	<div class="All">
		<!-- Loading -->
		<Loading v-if="spinner" />
		<!-- Toasts -->
		<Toasts />
		<!-- Menu -->
		<MenuHeader />
		<main>
			<slot />
			<div v-if="$route.path === '/'" class="Collage">
				<h2>¿Estás listo para utilizar Alpaca Tattoo?</h2>
				<img
					src="@/assets/illustrations/collage.webp"
					alt="Collage Alpaca"
				/>
			</div>
		</main>
		<Footer />
	</div>
</template>

<style scoped lang="scss">
main {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 250px;
	flex-direction: column;
}

main div {
	width: 100%;
	max-width: 1600px;
}

.Collage {
	h2 {
		text-align: center;
		padding: 10px;
		background-color: var(--color-main);
		color: var(--color-with-main);
	}
	img {
		width: 100%;
	}
}
</style>
