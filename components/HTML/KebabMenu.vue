<script lang="ts" setup>
import type { Component } from 'vue'
import { PhDotsThreeVertical } from '@phosphor-icons/vue'

withDefaults(
	defineProps<{
		items: Array<{
			text: string
			icon: Component
			click?: () => any
			to?: string
		}>
		isAbsolute?: boolean
	}>(),
	{ isAbsolute: true },
)

const showMenu = ref(false)
</script>

<template>
	<aside :class="{ Absolute: isAbsolute, NotAbsolute: !isAbsolute }">
		<HTMLSimpleButton type="button" :click="() => (showMenu = !showMenu)">
			<PhDotsThreeVertical :size="20" />
		</HTMLSimpleButton>

		<Transition>
			<menu v-if="showMenu">
				<div v-for="(item, i) in items" :key="i" class="Item">
					<HTMLInvisibleButton
						v-if="item.click"
						:click="
							() => {
								if (item.click) item.click()
								showMenu = false
							}
						"
					>
						<component :is="item.icon" :size="16" />
						<p>{{ item.text }}</p>
					</HTMLInvisibleButton>
					<HTMLSimpleAnchor v-else-if="item.to" :to="item.to">
						<component :is="item.icon" :size="16" />
						<p>{{ item.text }}</p>
					</HTMLSimpleAnchor>
				</div>
			</menu>
		</Transition>
	</aside>
</template>

<style scoped>
.Absolute {
	position: absolute;
	right: 0;
	top: 5px;
}

.NotAbsolute {
	position: relative;
}

button {
	display: flex;
	align-items: center;
	gap: 5px;
}

.NotAbsolute menu {
	right: 40px;
	top: -3px;
}

menu {
	position: absolute;
	right: 30px;
	top: -8px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	gap: 5px;
	background-color: var(--color-main);
	box-shadow: var(--box-shadow);
	background-color: var(--color-bg);
	padding: 8px;
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.Item {
	display: flex;
	gap: 5px;
	align-items: center;
}
</style>
