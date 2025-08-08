<script lang="ts" setup>
const { t } = useI18n()

const { to } = defineProps<{
	to: {
		username?: string
		idStudio?: number
	}
}>()

function copyLink() {
	navigator.clipboard
		.writeText(
			`${useRuntimeConfig().public.URL_CLIENT}/${to.username ? `${to.username}` : `s/${to.idStudio}`}/calendar/new`,
		)
		.then(() =>
			useToastsStore().addToast({
				message: t('calendar.copied'),
				type: 'success',
				timeout: 1000,
			}),
		)
		.catch(() =>
			useToastsStore().addToast({
				message: t('calendar.failShare'),
				type: 'error',
				timeout: 1000,
			}),
		)
}
</script>

<template>
	<div class="Share">
		<HTMLButton type="button" :click="copyLink">
			<i class="fa-solid fa-share-from-square"></i>
			{{ $t('calendar.shareLink') }}
		</HTMLButton>
	</div>
</template>
