<template>
	<div class="post-skeleton">
		<!-- Header with avatar and user info -->
		<div class="post-header">
			<div class="avatar-skeleton"></div>
			<div class="user-info">
				<div class="username-skeleton"></div>
				<div class="handle-skeleton"></div>
			</div>
		</div>

		<!-- Post content text -->
		<div class="post-content">
			<div class="text-line-skeleton"></div>
			<div class="text-line-skeleton short"></div>
		</div>

		<!-- Main image -->
		<div class="image-skeleton"></div>

		<!-- Footer with engagement -->
		<div class="post-footer">
			<div class="engagement-skeleton">
				<div class="heart-icon-skeleton"></div>
				<div class="count-skeleton"></div>
				<div class="time-skeleton"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.post-skeleton {
	max-width: 500px;
	margin: 0 auto;
	padding: 16px;
	width: 100%;
	border-radius: 12px;
}

.post-header {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 12px;
}

.avatar-skeleton {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
	flex-shrink: 0;
}

.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.username-skeleton {
	width: 140px;
	height: 16px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.handle-skeleton {
	width: 100px;
	height: 14px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.post-content {
	margin-bottom: 16px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.text-line-skeleton {
	height: 16px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.text-line-skeleton.short {
	width: 60%;
}

.image-skeleton {
	width: 100%;
	height: 300px;
	border-radius: 12px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
	margin-bottom: 12px;
}

.post-footer {
	display: flex;
	align-items: center;
}

.engagement-skeleton {
	display: flex;
	align-items: center;
	gap: 8px;
}

.heart-icon-skeleton {
	width: 16px;
	height: 16px;
	border-radius: 2px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.count-skeleton {
	width: 20px;
	height: 14px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.time-skeleton {
	width: 80px;
	height: 14px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
	0% {
		background-position: -200% 0;
	}
	100% {
		background-position: 200% 0;
	}
}

/* Responsive design */
@media (max-width: 640px) {
	.post-skeleton {
		margin: 0;
		border-radius: 0;
		box-shadow: none;
		border-bottom: 1px solid #e5e5e5;
	}

	.image-skeleton {
		height: 250px;
	}
}
</style>
