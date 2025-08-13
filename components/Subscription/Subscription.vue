<script lang="ts" setup>
import type { Subscription } from '~/models/payments/subscription.model'

defineProps<{
	subscription: Subscription | null
}>()
</script>

<template>
	<section v-if="subscription" class="Subscription">
		<header v-if="subscription.plan.bannerUrl">
			<img :src="subscription.plan.bannerUrl" alt="Banner" />
		</header>
		<div class="Subscription__Content">
			<h2>{{ subscription.plan.name }}</h2>

			<HTMLTable :header="[]">
				<tr v-if="subscription.status !== 'canceled'">
					<td class="ThHeader">{{ $t('subscription.type') }}</td>
					<td class="ThContent">
						{{
							$t('subscription.everyMonthly', {
								anchor: subscription.billingAnchor,
							})
						}}
					</td>
				</tr>
				<tr>
					<td class="ThHeader">
						{{ $t('subscription.status') }}
					</td>
					<td class="ThContent">
						{{ $t(`subscription.statuses.${subscription.status}`) }}
					</td>
				</tr>
				<tr v-if="subscription.status !== 'canceled'">
					<td class="ThHeader">
						{{ $t('subscription.nextBilling') }}
					</td>
					<td class="ThContent">
						{{ formatMiniDate(subscription.nextBillingDate) }}
					</td>
				</tr>
				<tr v-else>
					<td class="ThHeader">
						{{ $t('subscription.finishAt') }}
					</td>
					<td class="ThContent">
						{{ formatMiniDate(subscription.cancelledAt ?? '') }}
					</td>
				</tr>
				<tr v-if="subscription.status !== 'canceled'">
					<td class="ThHeader">
						{{ $t('subscription.paymentMethod') }}
					</td>
					<td class="ThContent">
						<HTMLAnchorButton
							v-if="subscription.updateMethodUrl"
							:to="subscription.updateMethodUrl"
							target="_blank"
							rel="external"
						>
							{{ $t('subscription.changeMethod') }}
						</HTMLAnchorButton>
						{{
							$t('subscription.method', {
								brand: subscription.cardBrand,
								numbers: subscription.cardLastFour,
							})
						}}
					</td>
				</tr>
			</HTMLTable>
		</div>
	</section>
	<Empty v-else :text="$t('billing.noSubscription')" :margin-top="false" />
</template>

<style scoped>
.Subscription {
	border: 1px solid var(--color-light);
}

.Subscription__Content {
	padding: 10px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

img {
	width: 100%;
	max-height: 200px;
	object-fit: cover;
}

h2 {
	text-align: left;
}

.ThHeader {
	text-align: left;
}

.ThContent {
	text-align: right;
	font-weight: bold;
	color: var(--color-second);
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text-wrap: nowrap;
	gap: 5px;
}

@media (max-width: 768px) {
	.ThContent {
		text-wrap: initial;
	}
}
</style>
