<script lang="ts" setup>
import 'quill/dist/quill.core.css'
// i18n
const { t } = useI18n()

onMounted(async () => {
	const { default: Quill } = await import('quill')

	new Quill('#editor', {
		placeholder: t('profile.publisher.what'),
	})
})
</script>

<template>
	<ClientOnly fallback-tag="div">
		<div id="editor"></div>
	</ClientOnly>
</template>
