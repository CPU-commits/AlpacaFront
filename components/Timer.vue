<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
defineExpose({ startCountdown })

const { minutes, autoStart } = withDefaults(
	defineProps<{
		minutes?: number
		autoStart?: boolean
	}>(),
	{
		minutes: 1,
		autoStart: true,
	},
)

const emit = defineEmits(['finished'])

const remainingSeconds = ref(minutes * 60)
const finished = ref(false)
let intervalId: any = null

const formattedTime = computed(() => {
	const mins = Math.floor(remainingSeconds.value / 60)
	const secs = remainingSeconds.value % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

function startCountdown() {
	if (intervalId) clearInterval(intervalId)
	finished.value = false
	remainingSeconds.value = minutes * 60

	intervalId = setInterval(() => {
		if (remainingSeconds.value > 0) {
			remainingSeconds.value--
		}
	}, 1000)
}

watch(remainingSeconds, (newVal) => {
	if (newVal === 0) {
		finished.value = true
		clearInterval(intervalId)
		emit('finished')
	}
})

onMounted(() => {
	if (autoStart) startCountdown()
})

onUnmounted(() => {
	clearInterval(intervalId)
})
</script>

<template>
	<div>
		<p v-if="!finished">{{ formattedTime }}</p>
	</div>
</template>
