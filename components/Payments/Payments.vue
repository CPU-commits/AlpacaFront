<script lang="ts" setup>
import type { Payment } from '~/models/payments/payment.model'

defineProps<{
	payments: Array<Payment>
	perPage: number
}>()

defineEmits<{
	(e: 'update:page', v: number): void
}>()
</script>

<template>
	<section class="Payments">
		<HTMLTable
			:header="[]"
			:navigate="{
				activate: true,
				max: perPage,
				fn: (n) => $emit('update:page', n),
			}"
		>
			<tr v-for="payment in payments" :key="payment.id">
				<td class="Left">
					<i
						v-if="payment.status === 'paid'"
						class="fa-solid fa-circle-check"
					></i>
					<i
						v-else-if="payment.status === 'pending'"
						class="fa-solid fa-circle"
					></i>
					<i
						v-else-if="payment.status === 'refunded'"
						class="fa-solid fa-circle-arrow-up"
					></i>
					<i
						v-else-if="payment.status === 'refused'"
						class="fa-solid fa-circle-xmark"
					></i>
					{{ formatDate(payment.updatedAt) }}
				</td>
				<td v-if="payment.price === 0">
					{{ $t('subscription.freeTier') }}
				</td>
				<td v-else>-</td>
				<td class="Right">{{ payment.priceFormated }}</td>
			</tr>
		</HTMLTable>
	</section>
</template>
