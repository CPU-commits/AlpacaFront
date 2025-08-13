<script lang="ts" setup>
import type { Plan } from '~/models/payments/plan.model'

defineProps<{
	plans: Array<Plan>
}>()

defineEmits<{
	(e: 'plan', v: number): void
	(e: 'planFor', v: { for: 'studio' | 'user'; idPlan: number }): void
}>()
</script>

<template>
	<section class="Plans">
		<div v-for="plan in plans" :key="plan.id" class="Plan">
			<header v-if="plan.bannerUrl">
				<img :src="plan.bannerUrl" alt="Banner" />
			</header>
			<div class="Plan__content">
				<h2>{{ plan.name }}</h2>
				<p>{{ plan.description }}</p>

				<div class="Plan__content--pricing">
					<span class="Plan__content--price">
						${{ plan.price }}
					</span>
					{{
						$t(`subscription.pricingModels.${plan.pricingModel}`, {
							billingCycle: $t(
								`subscription.billingCycles.${plan.billingCycle}`,
							),
							volumeItem: $t(
								`subscription.volumeItems.${plan.volumeItem}`,
							),
						})
					}}
				</div>
				<HTMLButton
					type="button"
					:click="
						() => {
							$emit('plan', plan.id)
							$emit('planFor', {
								for: plan.forStudios ? 'studio' : 'user',
								idPlan: plan.id,
							})
						}
					"
				>
					{{ $t('subscription.subscribe') }}
				</HTMLButton>
			</div>
		</div>
	</section>
</template>

<style scoped>
.Plans {
	display: flex;
	justify-content: center;
	gap: 20px;
	flex-wrap: wrap;
}

.Plan {
	border: 1px solid var(--color-light);
	border-radius: 8px;
	transition: all 0.4s ease;
	max-width: 350px;
}

.Plan:hover {
	border-color: transparent;
	box-shadow: var(--box-shadow);
}

p {
	font-size: 0.9rem;
}

.Plan__content {
	padding: 15px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.Plan img {
	width: 100%;
	border-radius: 8px;
}

.Plan__content--pricing {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.Plan__content--price {
	text-align: center;
	font-size: 2rem;
	color: var(--color-main);
}
</style>
