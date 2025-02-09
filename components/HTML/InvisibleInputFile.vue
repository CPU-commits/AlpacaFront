<script lang="ts" setup>
// Props
const { filter, onChange } = defineProps<{
	onChange: (files: Array<File>) => void
	accept?: string
	filter?: {
		type: RegExp
		message: string
	}
	multiple?: boolean
}>()
// Ref
const input = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
	(e: 'onClick', v: () => void): void
}>()

onMounted(() => {
	emit('onClick', () => {
		input.value?.click()
	})
})

function onChangeFiles() {
	const files = input.value?.files
	const filesToEmit: Array<File> = []

	for (let i = 0; i < (files?.length ?? 0); i++) {
		const file = files?.item(i)
		if (!file) return
		if (filter && !filter.type.test(file.type)) {
			useToastsStore().addToast({
				message: filter.message,
				type: 'error',
			})
			throw new Error(filter.message)
		}
		filesToEmit.push(file)
	}
	// On change
	onChange(filesToEmit)
}
</script>

<template>
	<input
		ref="input"
		type="file"
		:accept="accept"
		:multiple="multiple"
		@change="onChangeFiles"
	/>
</template>

<style scoped>
input {
	display: none;
}
</style>
