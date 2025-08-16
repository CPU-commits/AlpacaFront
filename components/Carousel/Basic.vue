<script setup lang="ts">
defineProps<{
	images: Array<string>
}>()
</script>

<template>
	<NuxtImg
		v-if="images.length === 1"
		class="carousel__item"
		fit="fill"
		:src="images[0]"
		provider="cloudinary"
	/>
	<Carousel v-else class="CarouselBasic">
		<Slide v-for="(img, index) in images" :key="index">
			<div class="carousel__item">
				<NuxtImg fit="fill" :src="img" provider="cloudinary" />
			</div>
		</Slide>

		<template #addons>
			<Navigation />
			<Pagination />
		</template>
	</Carousel>
</template>

<style scoped>
img {
	width: fit-content;
	object-fit: contain;
	max-height: 300px;
	border-radius: 8px;
	display: flex;
	height: 100%;
	justify-content: center;
	align-items: center;
}
</style>

<style>
.carousel__item img {
	width: 100% !important;
}

.CarouselBasic .carousel__slide {
	display: flex;
	justify-content: center;
	align-items: center;
}
.CarouselBasic .carousel__prev,
.CarouselBasic .carousel__next {
	box-sizing: content-box;
}

.CarouselBasic .carousel__next--disabled,
.CarouselBasic .carousel__prev--disabled {
	display: none;
}

.CarouselBasic .carousel__icon:hover {
	fill: var(--color-second);
}
.CarouselBasic .carousel__pagination {
	margin: 0;
}

.CarouselBasic .carousel__pagination-button::after {
	border-radius: 50%;
	width: 8px;
	height: 8px;
}
</style>
