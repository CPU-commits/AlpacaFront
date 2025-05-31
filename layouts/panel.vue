<template>
	<div class="Panel">
		<div class="Panel__content">
			<nav class="Panel__nav">
				<i class="fa-solid fa-calendar-week"></i>
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
}

.Panel__nav {
	width: fit-content;
	background-color: var(--color-main);
	box-shadow: var(--box-shadow);
	padding: 10px;
	height: fit-content;
}

i {
	color: white;
}

.Panel__content--slot {
	width: 100%;
}
</style>
