<script lang="ts" setup>
const props = defineProps<{
	stars?: number
	editable?: boolean
	starsSize?: 'normal' | 'xl'
}>()

const selected = ref(props.stars ?? 0)
const hover = ref<null | number>(null)

const emit = defineEmits<{
	(e: 'update:stars', stars: number): void
}>()

watch(selected, (selected) => {
	emit('update:stars', selected)
})
</script>

<template>
	<div class="Stars">
		<div
			v-for="i in 5"
			:key="i"
			@click="
				() => {
					if (editable) selected = i
				}
			"
			@mouseenter="() => (hover = i)"
			@mouseleave="() => (hover = null)"
		>
			<i
				class="fa-solid fa-star"
				:class="{
					Selected:
						selected >= i || (editable && hover && hover >= i),
					Xl: starsSize === 'xl',
				}"
			></i>
		</div>
	</div>
</template>

<style scoped>
.Stars {
	display: flex;
	gap: 10px;
}

i {
	transition: all 0.4s ease;
	font-size: 1rem;
}

.Xl {
	font-size: 1.3rem;
}

.Selected {
	color: var(--color-main);
}
</style>
