<template>
	<div class="image-first-skeleton">
		<!-- Main image at the top -->
		<div class="main-image-skeleton"></div>

		<!-- Content section -->
		<div class="content-section">
			<!-- User info with avatar -->
			<div class="user-header">
				<div class="avatar-skeleton"></div>
				<div class="user-details">
					<div class="username-skeleton"></div>
					<div class="handle-skeleton"></div>
				</div>
			</div>

			<!-- Post text content -->
			<div class="post-text">
				<div class="text-line-skeleton"></div>
				<div class="text-line-skeleton"></div>
				<div class="text-line-skeleton short"></div>
			</div>

			<!-- Engagement footer -->
			<div class="engagement-footer">
				<div class="signal-icon-skeleton"></div>
				<div class="heart-section">
					<div class="heart-icon-skeleton"></div>
					<div class="count-skeleton"></div>
				</div>
				<div class="timestamp-skeleton"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.image-first-skeleton {
	width: 100%;
}

.main-image-skeleton {
	width: 100%;
	border-radius: 8px;
	height: 320px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.content-section {
	padding: 16px;
}

.user-header {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
}

.avatar-skeleton {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
	flex-shrink: 0;
}

.user-details {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.username-skeleton {
	width: 120px;
	height: 16px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.handle-skeleton {
	width: 90px;
	height: 14px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.post-text {
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
	width: 75%;
}

.engagement-footer {
	display: flex;
	align-items: center;
	gap: 12px;
	padding-top: 8px;
	border-top: 1px solid #f0f0f0;
}

.signal-icon-skeleton {
	width: 16px;
	height: 16px;
	border-radius: 2px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.heart-section {
	display: flex;
	align-items: center;
	gap: 6px;
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
	width: 16px;
	height: 14px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
}

.timestamp-skeleton {
	width: 85px;
	height: 14px;
	border-radius: 4px;
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: shimmer 1.5s infinite;
	margin-left: auto;
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
	.image-first-skeleton {
		margin: 0;
		border-radius: 0;
		box-shadow: none;
	}

	.main-image-skeleton {
		height: 280px;
	}

	.content-section {
		padding: 12px;
	}

	.text-line-skeleton.short {
		width: 85%;
	}
}

/* Staggered animation for more realistic effect */
.avatar-skeleton {
	animation-delay: 0.1s;
}

.username-skeleton {
	animation-delay: 0.2s;
}

.handle-skeleton {
	animation-delay: 0.3s;
}

.text-line-skeleton:nth-child(1) {
	animation-delay: 0.4s;
}

.text-line-skeleton:nth-child(2) {
	animation-delay: 0.5s;
}

.text-line-skeleton:nth-child(3) {
	animation-delay: 0.6s;
}
</style>
