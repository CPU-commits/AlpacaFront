<script lang="ts" setup>
defineProps<{
	id: string
	name: string
	title: string
	checked?: boolean
}>()
</script>

<template>
	<input :id="id" type="radio" :name="name" :checked="checked" />
	<label class="item" :for="id">
		<div class="title">{{ title }}</div>
		<div class="content">
			<slot />
		</div>
	</label>
</template>

<style scoped lang="scss">
input[type='radio'] {
	display: none;
	&:checked + .item {
		.title {
			color: #fff;
			border-color: var(--color-main);
			background-color: var(--color-main);
			&:after {
				transform: rotate(180deg);
			}
		}
		.content {
			// for animation! can use padding or margin here
			margin-top: 0.3rem;
			margin-bottom: 0.3rem;
			// show content
			height: auto;
			opacity: 1;
			visibility: visible;
			transition:
				all 0.3s,
				opacity 0.7s; // fade-in slow
		}
	}
}

.item {
	display: block;
	margin-bottom: 0.1rem;
}

.title {
	padding: 0.1rem 0.3rem;
	border-radius: 8px;
	color: var(--color-main);
	border: 1px solid;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s;
	// aligned arrow
	display: flex;
	justify-content: space-between;
	align-items: center;
	// arrow icon
	&:after {
		content: '\25bc';
		display: inline-block;
		font-size: 12px;
	}
}

.content {
	padding: 0 0.3rem;
	line-height: 1.6;
	color: var(--color-main);
	border-width: 0 1px;
	height: 0;
	opacity: 0;
	visibility: hidden;
	transition: all 0.2s; // fade-out fast
}
</style>
