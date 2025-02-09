<script setup lang="ts">
// Types
type Navigate = {
	activate: boolean
	fn?: (n: number) => any
	max?: number
}
defineProps<{
	header: Array<string>
	navigate?: Navigate
	totalName?: string
}>()

// Memo
defineEmits<{
	(e: 'memo', value: any): void
}>()
</script>

<template>
	<div class="Container">
		<section class="Table">
			<table>
				<thead class="Thead">
					<tr>
						<slot name="header" />
						<ClientOnly>
							<!-- eslint-disable vue/no-v-html -->
							<td
								v-for="(tdElement, i) in header"
								:key="i"
								v-html="tdElement"
							/>
						</ClientOnly>
					</tr>
				</thead>
				<tbody class="Tbody">
					<slot />
				</tbody>
			</table>
		</section>

		<slot name="footer" />
		<HTMLNav
			v-if="navigate?.activate"
			:navigate="navigate"
			:total-name="totalName"
			@memo="(value: any) => $emit('memo', value)"
		/>
	</div>
</template>

<style scoped>
.Container {
	position: relative;
	width: 100%;
}

.Table {
	overflow-x: auto;
	width: 100%;
}

table {
	width: 100%;
	border-collapse: collapse;
}

tr {
	text-align: center;
}

tr td {
	color: var(--color-main);
	font-weight: 700;
	padding: 0 5px;
	white-space: nowrap;
}

@media (max-width: 767.98px) {
	tr td {
		font-size: 0.9rem;
	}
}

@media (max-width: 575.98px) {
	tr td {
		font-size: 0.9rem;
		padding-bottom: 5px;
	}
}
</style>
