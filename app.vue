<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
.blur-enter-active,
.blur-leave-active {
	transition: all 0.4s ease;
}

.blur-enter-from,
.blur-leave-to {
	opacity: 0;
	filter: blur(10px);
}

.blur-enter-to,
.blur-leave-from {
	opacity: 1;
	filter: blur(0);
}
</style>
