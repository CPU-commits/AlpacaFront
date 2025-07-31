<script setup lang="ts">
import { PhTrashSimple, PhPen } from '@phosphor-icons/vue'
import type { Design } from '~/models/design/design.model'

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

defineEmits<{
	(e: 'delete' | 'update' | 'showDesigns', v: number): void
}>()
</script>
<template>
	<article class="Design-card">
		<header class="Design-card_header">
			<HTMLKebabMenu
				v-if="
					useAuthStore().isOwnProfile ||
					useAuthStore().getID === design.profile.id
				"
				:items="[
					{
						icon: PhTrashSimple,
						text: $t('design.delete'),
						click() {
							$emit('delete', design.id)
						},
					},
					{
						icon: PhPen,
						text: $t('design.update'),
						click() {
							$emit('update', design.id)
						},
					},
				]"
			/>
		</header>
		<div class="Design-card_img">
			<HTMLSimpleButton
				:click="
					() => {
						$emit('showDesigns', design.id)
					}
				"
				type="button"
			>
				<HTMLImg
					size="normal"
					:image="design.image.key"
					:from-provider="true"
					contain="contain"
				/>
			</HTMLSimpleButton>
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
			<div class="Design-card__description">
				<p v-if="design.description">
					{{ design.description }}
				</p>
				<p v-else>{{ $t('design.noDescription') }}</p>
			</div>
			<div class="Design-card__footer">
				<p>{{ timeAgo(design.createdAt) }}</p>
				<p v-if="design.price">
					{{ formattedPrice }}
				</p>
				<p v-else>{{ $t('design.noPrice') }}</p>
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
	border: 1px solid var(--color-light);
	transition: all 0.4s ease;
}

.Design-card:hover {
	box-shadow: var(--box-shadow);
	border-color: transparent;
}

.Design-card_header {
	position: relative;
	padding: 12px;
}
.Design-card_img {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
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

.Design-card__footer {
	margin-top: auto;
	display: flex;
	justify-content: space-between;
	font-size: 0.85rem;
	color: #999;
}
@media (max-width: 1400px) {
	.Design-card__footer {
		font-size: 0.7rem;
	}
}
</style>
