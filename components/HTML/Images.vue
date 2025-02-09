<script lang="ts" setup>
import { PhDot } from '@phosphor-icons/vue'

defineProps<{
	images: Array<string>
}>()

const currentSlide = ref(0)
</script>

<template>
	<div class="Carousel">
		<Carousel v-model="currentSlide">
			<Slide v-for="(image, i) in images" :key="i">
				<img :src="image" alt="" />
			</Slide>
		</Carousel>
		<div class="Slider">
			<PhDot
				v-for="i in images.length"
				:key="i"
				:color="
					i - 1 === currentSlide
						? 'var(--color-main)'
						: 'var(--color-light)'
				"
			/>
		</div>
	</div>
</template>

<style scoped>
img {
	max-height: 200px;
	object-fit: cover;
	width: 100%;
	border-radius: 8px;
	aspect-ratio: 16/9;
}

.Slider {
	display: flex;
	justify-content: center;
}
</style>
