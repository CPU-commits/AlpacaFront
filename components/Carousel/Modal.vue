<script setup lang="ts">
const props = defineProps<{
	images: Array<{ id: number; src: string }>
	selectedId?: number
}>()
const startIndex = props.images.findIndex((img) => img.id === props.selectedId)
const currentSlide = ref(startIndex >= 0 ? startIndex : 0)
</script>

<template>
	<NuxtImg
		v-if="images.length === 1"
		class="carousel__item"
		fit="fill"
		:src="images[0].src"
		provider="cloudinary"
	/>
	<Carousel v-else v-model="currentSlide" :height="'100vh'">
		<Slide v-for="(img, index) in images" :key="index" :index="index"
			><NuxtImg
				:src="img.src"
				fit="cover"
				format="auto"
				quality="auto"
				class="ImageModal__img"
				provider="cloudinary"
			/>
		</Slide>

		<template #addons>
			<Navigation />
			<Pagination />
		</template>
	</Carousel>
</template>

<style>
.carousel__prev,
.carousel__next {
	border-radius: 50%;
	padding: 0.5rem;
	transition: background-color 0.3s ease;
}
.carousel__next--disabled,
.carousel__prev--disabled {
	display: none;
}

.carousel__icon {
	fill: var(--color-with-main);
}

.carousel__pagination-button {
	background-color: var(--color-light);
	transition: background-color 0.3s ease;
	height: 10px;
	width: 10px;
	border-radius: 16px;
}

.carousel__pagination-button--active {
	background-color: var(--color-main);
}

.carousel__pagination-button:hover {
	background-color: var(--color-second);
}
.ImageModal__img {
	max-width: 100%;
	max-height: 90%;
	object-fit: contain;
	border-radius: 12px;
}
</style>
