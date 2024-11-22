<script setup lang="ts">
// Stores
const toasts = useToastsStore()
</script>

<template>
	<section>
		<TransitionGroup>
			<Toast
				v-for="toast in toasts.getToasts"
				:key="toast.id"
				:type="toast.type"
				:dismissible="toast.dismissible ?? false"
				:_id="toast.id"
				@delete="() => toasts.dismissToast(toast.id)"
			>
				{{ toast.message }}
			</Toast>
		</TransitionGroup>
	</section>
</template>

<style scoped>
section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	display: flex;
	margin-bottom: 1rem;
	justify-content: center;
	flex-direction: column;
	z-index: 1001;
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
