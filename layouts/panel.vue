<template>
	<div class="Panel">
		<div class="Panel__content">
			<nav class="Panel__nav">
				<NuxtLink to="calendar">
					<i class="fa-solid fa-calendar-week"></i>
				</NuxtLink>
				<NuxtLink to="subscription">
					<i class="fa-solid fa-credit-card"></i>
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

.Panel__nav {
	width: fit-content;
	background-color: var(--color-main);
	box-shadow: var(--box-shadow);
	padding: 10px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	height: fit-content;
}

i {
	color: white;
}

.Panel__content--slot {
	width: 100%;
	display: flex;
	flex-direction: column;
	max-width: 800px;
	gap: 20px;
}
</style>
