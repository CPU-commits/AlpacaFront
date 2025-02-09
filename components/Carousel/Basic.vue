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
	<Carousel v-else>
		<Slide v-for="(img, index) in images" :key="index"
			><NuxtImg
				class="carousel__item"
				fit="fill"
				:src="img"
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
.carousel__item {
	border-radius: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: fit-content;
	object-fit: contain;
	max-height: 295px;
}

.carousel__slide {
	display: flex;
	justify-content: center;
	align-items: center;
}
.carousel__prev,
.carousel__next {
	box-sizing: content-box;
}

.carousel__next--disabled,
.carousel__prev--disabled {
	display: none;
}

.carousel__icon:hover {
	fill: var(--color-second);
}
.carousel__pagination {
	margin: 0;
}

.carousel__pagination-button::after {
	border-radius: 50%;
	width: 8px;
	height: 8px;
}
</style>
