<script lang="ts" setup>
defineProps<{
	action: () => any
}>()
</script>

<template>
	<div class="MinimalForm">
		<div class="MinimalForm__content">
			<HTMLForm :action="action">
				<template #title>
					<slot name="title" />
				</template>

				<slot />
			</HTMLForm>
		</div>
	</div>
</template>

<style scoped lang="scss">
.MinimalForm {
	display: flex;
	justify-content: center;
}

.MinimalForm__content {
	width: 450px;
	padding: 15px;
	height: fit-content;
	border-radius: 10px;
	border: 1px solid var(--color-light);
	transition: all 0.4s ease;
}

.MinimalForm__content:hover {
	box-shadow: var(--box-shadow);
	border: 1px solid transparent;
}
</style>
