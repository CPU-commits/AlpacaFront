<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	image: string
	fromProvider?: boolean
	contain?: boolean
}>()

const fitClass = computed(() => (props.contain ? 'Contain' : 'Cover'))
</script>

<template>
	<div class="Img">
		<NuxtImg
			v-if="props.fromProvider"
			:src="props.image"
			provider="cloudinary"
			:class="fitClass"
			alt="Imagen"
		/>
		<img v-else :src="props.image" :class="fitClass" alt="Imagen" />
	</div>
</template>

<style scoped>
.Img {
	width: 100%;
	border-radius: 8px;
}

.Img img,
.Img .nuxt-img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.Cover {
	object-fit: cover;
	object-position: center;
}

.Contain {
	object-fit: contain;
	object-position: center;
}
</style>
