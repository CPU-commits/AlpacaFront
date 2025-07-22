<template>
	<div class="progress">
		<div class="progress-value"></div>
	</div>
</template>

<style scoped>
.progress {
	background: rgba(255, 255, 255, 0.1);
	justify-content: flex-start;
	border-radius: 100px;
	align-items: center;
	position: relative;
	padding: 0 5px;
	display: flex;
	height: 40px;
	width: 100%;
}

.progress-value {
	animation: load 5s normal forwards;
	border-radius: 100px;
	background: var(--color-main);
	height: 10px;
	width: 0;
}

@keyframes load {
	0% {
		width: 100%;
	}
	100% {
		width: 0;
	}
}
</style>
