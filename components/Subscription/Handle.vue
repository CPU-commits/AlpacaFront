<script lang="ts" setup>
import type { Payment } from '~/models/payments/payment.model'

const { idStudio } = defineProps<{
	idStudio?: number
}>()

useHead({
	script: [{ src: 'https://app.lemonsqueezy.com/js/lemon.js', defer: true }],
})
// i18n
const { t } = useI18n()
// Modals
const modalCancel = ref(false)

const { data, error: errSub } = await useAsyncData(async (app) => {
	return await Promise.all([
		app?.$subscriptionService.getMySubscription({ idStudio }),
		app?.$subscriptionService.getPlans({
			forStudios: idStudio !== undefined,
		}),
	]).then((data) => ({
		subscription: data[0],
		plans: data[1],
	}))
})
const totalPayments = ref(0)
const perPagePayments = ref(1)
const payments = ref<Array<Payment> | null>(null)
provide('total', totalPayments)

async function requestSubscription(idPlan: number) {
	const urlRequested =
		await useNuxtApp().$subscriptionService.requestSubscription(idPlan, {
			idStudio,
		})
	if (urlRequested) window.open(urlRequested, '_self')
}

async function getPayments(page?: number) {
	const dataFetch = await useNuxtApp().$paymentService.getPayments({
		page,
		idSubscription: data.value?.subscription?.id,
	})

	payments.value = dataFetch.payments
	totalPayments.value = dataFetch.total
	perPagePayments.value = dataFetch.perPage
}

onMounted(() => {
	if (data.value?.subscription) getPayments()
})

async function cancelSubscription() {
	const success = await useNuxtApp().$subscriptionService.cancelSubscription()
	if (success) {
		useToastsStore().addToast({
			message: t('subscription.successCanceled'),
			type: 'success',
		})
		modalCancel.value = false
	}
}
</script>

<template>
	<ErrorWrapper :errors="[errSub]">
		<div class="Billing">
			<template
				v-if="
					data?.plans &&
					(!data.subscription ||
						data.subscription.status === 'canceled')
				"
			>
				<h3>{{ $t('subscription.ourPlans') }}</h3>
				<Plans :plans="data.plans" @plan="requestSubscription" />
			</template>

			<h3>{{ $t('billing.subscription') }}</h3>
			<Subscription :subscription="data?.subscription ?? null" />

			<HTMLDangerButton
				v-if="
					data?.subscription &&
					data?.subscription?.status !== 'canceled'
				"
				type="button"
				:click="() => (modalCancel = true)"
			>
				{{ $t('subscription.cancel') }}
			</HTMLDangerButton>

			<section v-if="payments" class="Payments">
				<h3>{{ $t('subscription.payments') }}</h3>

				<Payments
					:payments="payments"
					:per-page="perPagePayments"
					@update:page="getPayments"
				/>
				<Empty
					v-if="payments && payments.length === 0"
					:text="$t('subscription.noPayments')"
				/>
			</section>
		</div>
	</ErrorWrapper>

	<EmptyModal :opened="modalCancel">
		<header class="Header">
			<span class="Tag">{{ $t('subscription.cancel') }}</span>

			<h1>{{ $t('subscription.sorry') }}</h1>
			<p>
				{{
					$t('subscription.cancelMessage', {
						name: data?.subscription?.plan.name,
					})
				}}
			</p>
		</header>

		<HTMLAnchorButton to="/">
			{{ $t('subscription.cancelCons') }}
		</HTMLAnchorButton>
		<ModalButtons>
			<HTMLButton
				type="button"
				without-background
				:click="() => (modalCancel = false)"
			>
				{{ $t('subscription.keepPlan') }}
			</HTMLButton>
			<HTMLButton type="button" :click="cancelSubscription">
				{{ $t('subscription.cancel') }}
			</HTMLButton>
		</ModalButtons>
	</EmptyModal>
</template>

<style scoped>
.Billing {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.Header {
	display: flex;
	flex-direction: column;
	gap: 20px;
	border-bottom: 1px solid var(--color-light);
	padding-bottom: 20px;
}
</style>
