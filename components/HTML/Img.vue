<script setup lang="ts">
const props = defineProps<{
	image: string
	fromProvider?: boolean
	contain: 'contain' | 'cover' | 'fill'
	size?: 's' | 'normal' | 'sm'
	imgHover?: boolean
}>()
</script>

<template>
	<div
		class="Img"
		:class="{
			'Img--normal': size === 'normal',
			'Img--s': size === 's',
			'IMG--sm': size === 'sm',
			Hover: imgHover,
		}"
	>
		<NuxtImg
			v-if="props.fromProvider"
			:src="props.image"
			provider="cloudinary"
			:class="{
				Contain: contain === 'contain',
				Cover: contain === 'cover',
				Fit: contain === 'fill',
			}"
			alt="Imagen"
		/>
		<img
			v-else
			:src="props.image"
			:class="{
				'Img--normal': size === 'normal',
				'Img--s': size === 's',
			}"
			alt="Imagen"
		/>
	</div>
</template>

<style scoped>
.Img {
	position: relative;
	display: inline-block;
	overflow: hidden;
	border-radius: 8px;
	box-sizing: border-box;
}

.Img--s {
	width: 90px;
	height: 90px;
}
.Img--sm {
	width: 40px;
	height: 40px;
}

.Img--normal {
	max-height: 90%;

	aspect-ratio: 16/9;
}

.Img img,
.Img .nuxt-img {
	width: 100%;
	height: 100%;
	object-position: center;
	display: block;
}

.Cover {
	object-fit: cover;
}

.Contain {
	object-fit: contain;
}

.Fill {
	object-fit: fill;
}
.Hover:hover {
	opacity: 0.5;
}
</style>
