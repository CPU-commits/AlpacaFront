<template>
	<article class="Design-card skeleton">
		<header v-if="useAuthStore().isOwnProfile" class="Design-card_header">
			<div class="skeleton-box circle small right" />
		</header>

		<div class="Design-card_img skeleton-box image" />

		<section class="Design-card__categories">
			<div class="skeleton-box tag"></div>
			<div class="skeleton-box tag short"></div>
		</section>

		<section class="Design-card__info">
			<div class="Design-card__description">
				<div class="skeleton-box line long"></div>
				<div class="skeleton-box line short"></div>
			</div>
			<div class="Design-card__footer">
				<div class="skeleton-box line short"></div>
				<div class="skeleton-box line shorter"></div>
			</div>
		</section>
	</article>
</template>

<style scoped>
@keyframes pulse {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
	100% {
		opacity: 1;
	}
}

.Design-card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: #fff;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	animation: pulse 1.5s infinite ease-in-out;
}

.Design-card_header {
	position: relative;
	padding: 12px;
	display: flex;
	justify-content: flex-end;
}

.Design-card_img {
	width: 100%;
	height: 190px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #eee;
}

.Design-card__info,
.Design-card__categories {
	padding: 12px;
}

.Design-card__description {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 12px;
}

.Design-card__footer {
	display: flex;
	justify-content: space-between;
	gap: 8px;
}

/* Skeleton placeholders */

.skeleton-box {
	background-color: #ddd;
	border-radius: 4px;
	animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-box.line {
	height: 12px;
}

.skeleton-box.long {
	width: 80%;
}

.skeleton-box.short {
	width: 50%;
}

.skeleton-box.shorter {
	width: 30%;
}

.skeleton-box.tag {
	height: 20px;
	width: 80px;
	margin-bottom: 6px;
	border-radius: 12px;
	display: inline-block;
}

.skeleton-box.tag.short {
	width: 60px;
}

.skeleton-box.circle {
	border-radius: 50%;
	background-color: #ccc;
}

.skeleton-box.small {
	width: 24px;
	height: 24px;
}

.skeleton-box.image {
	height: 190px;
	width: 100%;
	border-radius: 0;
}

.right {
	margin-left: auto;
}
</style>
