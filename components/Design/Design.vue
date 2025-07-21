<script setup lang="ts">
import { HTMLImg } from '#components'
import { computed } from 'vue'
import type { Design } from '~/models/tattoo/design.model'

const props = defineProps<{ design: Design }>()

const formattedPrice = computed((): string => {
	const price = props.design.price
	return price != null
		? new Intl.NumberFormat('es-CL', {
				style: 'currency',
				currency: 'CLP',
				minimumFractionDigits: 0,
			}).format(price)
		: ''
})
</script>
<template>
	<article class="Design-card">
		<div class="Design-card_img">
			<HTMLImg :image="design.image.key" :from-provider="true" contain />
		</div>

		<section
			v-if="design.categories?.length"
			class="Design-card__categories"
		>
			<span
				v-for="category in design.categories"
				:key="category"
				class="Design-card__category"
				>{{ category }}</span
			>
		</section>

		<section class="Design-card__info">
			<div class="Design-card__price">
				<p v-if="design.price">
					{{ formattedPrice }}
				</p>
				<p v-else>{{ $t('design.noPrice') }}</p>
			</div>
			<div class="Design-card__description">
				<p v-if="design.description">
					{{ design.description }}
				</p>
				<p v-else>{{ $t('design.noDescription') }}</p>
			</div>
			<div class="Design-card__date">
				<p>{{ timeAgo(design.createdAt) }}</p>
			</div>
		</section>
	</article>
</template>

<style scoped>
.Design-card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: #fff;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.Design-card_img {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	aspect-ratio: 4 / 3;
	overflow: hidden;
}

.Design-card__info {
	display: flex;
	flex-direction: column;
	min-height: 100px;
}

.Design-card__categories,
.Design-card__info {
	padding: 12px;
}

.Design-card__category {
	display: inline-block;
	background: #eee;
	border-radius: 4px;
	padding: 4px 8px;
	margin: 0 6px 6px 0;
	font-size: 0.75rem;
}

.Design-card__price {
	font-weight: bold;
	margin: 4px 0;
}

.Design-card__description {
	margin: 4px 0;
	font-size: 0.9rem;
	color: #333;
}

.Design-card__date {
	margin-top: auto;
	font-size: 0.75rem;
	color: #999;
}
</style>
