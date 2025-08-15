<script setup lang="ts">
import Toasts from '~~/components/Toast/Toasts.vue'
const spinner = useSpinner()
// Drag
/*const isDragOver = ref(false)

function onDragEnter() {
	isDragOver.value = true
}

function onDragLeave() {
	isDragOver.value = false
}
*/
</script>

<template>
	<div class="All">
		<!--
		<div class="InvisibleDrag" :class="{ DragBg: isDragOver }">
			<div class="Modal__container" @dragover="onDragEnter">
				<h2>¡Suelta tus imagenes!</h2>
				<Illustration
					illustration="designs"
					:margin-top="false"
					:border="false"
				/>
			</div>
		</div>
		-->

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

/*
.InvisibleDrag {
	z-index: 99999;
	position: fixed;
	width: 100%;
	height: 100vh;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	top: 0;
}

.Modal__container {
	background-color: var(--color-second);
	max-height: 80%;
	position: absolute;
	top: calc(15vh);
	max-height: calc(100vh - 50px);
	overflow-y: auto;
	overflow-x: hidden;
	width: fit-content;
	border-radius: 4px;
	animation: modal 0.4s;
	h2 {
		color: var(--color-text-with-second);
		padding: 10px;
	}
	display: none;
}

.DragBg {
	background: rgba(0, 0, 0, 0.3);
	.Modal__container {
		display: block;
	}
}
*/
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
