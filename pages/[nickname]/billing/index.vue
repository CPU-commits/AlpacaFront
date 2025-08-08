<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})

const { data: subscription, error: errSub } = await useAsyncData(
	async (app) => {
		return await app?.$subscriptionService.getMySubscription()
	},
)
</script>

<template>
	<NuxtLayout name="panel">
		<ErrorWrapper :errors="[errSub]">
			<h3>{{ $t('billing.subscription') }}</h3>
			<Subscription :subscription="subscription ?? null" />
			<HTMLAnchorButton to="billing/subscription" primary>
				{{ $t('billing.manageSubscription') }}
			</HTMLAnchorButton>

			<h3>{{ $t('billing.history') }}</h3>
			<HTMLTable :header="[]"></HTMLTable>
			<Empty :text="$t('billing.noHistory')" :margin-top="false" />
		</ErrorWrapper>
	</NuxtLayout>
</template>
