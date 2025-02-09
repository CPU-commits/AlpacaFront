<script lang="ts" setup>
// Items
import type { Component } from 'vue'
import { PhHouse } from '@phosphor-icons/vue'

defineProps<{
	items: Array<{
		to: string
		icon?: Component
		tooltip?: number | string | null
	}>
	home?: string
}>()
</script>

<template>
	<div class="NavMenu">
		<nav class="Nav">
			<NuxtLink
				v-if="home"
				:to="home"
				:class="{ Selected: $route.path === home }"
			>
				<PhHouse
					height="30"
					:color="
						$route.path === home
							? 'var(--color-text-with-main)'
							: ''
					"
				/>
			</NuxtLink>
			<NuxtLink
				v-for="(item, i) in items"
				:key="i"
				:to="item.to"
				:class="{ Selected: $route.path.startsWith(item.to) }"
			>
				<aside
					v-if="item.tooltip !== undefined && item.tooltip !== null"
				>
					{{ item.tooltip }}
				</aside>

				<component
					:is="item.icon"
					height="30"
					:color="
						$route.path.startsWith(item.to)
							? 'var(--color-text-with-main)'
							: ''
					"
				/>
			</NuxtLink>
		</nav>
	</div>
</template>

<style scoped lang="scss">
.NavMenu {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0;
}

.Nav {
	display: flex;
	width: 100%;
	padding: 4px 10px;
	gap: 5px;
	justify-content: space-around;
	border-top: 1px solid var(--color-light);
	align-items: flex-end;
}

a {
	text-decoration: none;
	padding: 3px 5px;
	position: relative;
	aside {
		background-color: var(--color-main);
		color: var(--color-text-with-main);
		border-radius: 60px;
		width: 15px;
		height: 15px;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		right: 0px;
		top: 0;
	}
}

svg {
	display: flex;
}

.Selected {
	background-color: var(--color-main);
	border-bottom-left-radius: 8px;
	border-bottom-right-radius: 8px;
}
</style>
