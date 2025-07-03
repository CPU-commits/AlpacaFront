<template>
	<div class="Panel">
		<div class="Panel__content">
			<nav class="Panel__nav">
				<NuxtLink
					to="calendar"
					:class="{ Selected: $route.path.includes('/calendar') }"
				>
					<i class="fa-solid fa-calendar-week"></i>
					{{ $t('panel.calendar') }}
				</NuxtLink>
				<NuxtLink to="subscription">
					<i class="fa-solid fa-credit-card"></i>
					{{ $t('panel.billing') }}
				</NuxtLink>
			</nav>

			<div class="Panel__content--slot">
				<slot />
			</div>
		</div>
	</div>
</template>

<style scoped>
.Panel {
	width: 100%;
}

.Panel__content {
	display: flex;
	padding: 20px;
	gap: 20px;
	width: 100%;
	justify-content: center;
}

a {
	display: flex;
	align-items: center;
	gap: 10px;
}

.Selected {
	color: var(--color-second);
	i {
		color: var(--color-main);
	}
}

.Panel__nav {
	width: fit-content;
	padding: 10px;
	position: sticky;
	top: 10px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	height: fit-content;
}

.Panel__content--slot {
	width: 100%;
	display: flex;
	flex-direction: column;
	max-width: 800px;
	gap: 20px;
}
</style>
