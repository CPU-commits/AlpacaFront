<script setup lang="ts">
// Props
const props = withDefaults(
	defineProps<{
		type: 'success' | 'error' | 'info'
		dismissible: boolean
		// eslint-disable-next-line vue/prop-name-casing
		_id: number
	}>(),
	{ type: 'error', dismissible: true },
)

const emits = defineEmits(['delete'])

function emitDelete() {
	emits('delete', props._id)
}
</script>

<template>
	<Transition>
		<!-- eslint-disable-next-line vue/require-toggle-inside-transition -->
		<article :class="type" role="alert">
			<i v-if="type === 'success'" class="fa-solid fa-circle-check" />
			<i
				v-else-if="type === 'error'"
				class="fa-solid fa-circle-exclamation"
			/>
			<i v-else class="fa-solid fa-circle-info" />
			<div class="text">
				<slot />
			</div>
			<button v-if="dismissible" class="close" @click="emitDelete">
				<i class="fa-solid fa-xmark" />
			</button>
		</article>
	</Transition>
</template>

<style scoped>
article {
	color: white;
	padding: 0.75rem 1.5rem;
	border-radius: 0.2rem;
	display: flex;
	align-items: center;
	margin: 0 auto 0.5rem auto;
	width: 20rem;
	border: 2px solid var(--color-light);
}

.error {
	background: var(--color-danger);
}

.success {
	background: var(--color-success);
}

.info {
	background: var(--color-info);
}

.text {
	margin-left: 1rem;
	color: white;
}

button {
	background: transparent;
	border: 0 none;
	padding: 0;
	margin: 0 0 0 auto;
	line-height: 1;
	cursor: pointer;
	font-size: 1rem;
}

i {
	color: white;
}
</style>
