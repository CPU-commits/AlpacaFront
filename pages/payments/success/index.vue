<script lang="ts" setup>
const to = useRoute().query.to as string | undefined

onMounted(async () => {
	if (useAuthStore().isAuth) {
		await useAuthStore().refreshSession()
	}
})

// Meta
useSeoMeta(seoMetaNoIndex())
</script>

<template>
	<section class="Success">
		<h1>{{ $t('subscription.thanks') }}</h1>
		<p class="Text">{{ $t('subscription.thanksSecondText') }}</p>

		<Illustration
			illustration="sub"
			:margin-top="false"
			:text="$t('subscription.thanksText')"
		/>

		<HTMLAnchorButton v-if="to" :to="to">
			{{ $t('subscription.gotToSubscription') }}
		</HTMLAnchorButton>
	</section>
</template>

<style scoped>
.Success {
	padding: 30px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
}

h1 {
	text-align: center;
}

.Text {
	max-width: 500px;
	font-weight: bold;
	font-size: 1.1rem;
	text-align: center;
}
</style>
