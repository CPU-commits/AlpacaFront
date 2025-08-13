<script lang="ts" setup>
const storyblokApi = useStoryblokApi()

const { data } = await storyblokApi.get('cdn/stories', {
	starts_with: 'guides/',
	per_page: 5,
	page: 0,
})
</script>

<template>
	<footer class="Footer">
		<div class="Guides">
			<h4>{{ $t('footer.guides') }}</h4>
			<div class="Guides__content">
				<NuxtLink
					v-for="story in data.stories"
					:key="story.uuid"
					:to="`/${story.full_slug}`"
				>
					#{{ story.name }}
				</NuxtLink>
			</div>
		</div>
		<div class="Logo">
			<img src="/img/logoFullNegative.svg" alt="Logo" />
			<span>Wehhhh!</span>
		</div>
		<div class="Social">
			<h4>{{ $t('footer.social') }}</h4>
			<div class="Social__content">
				<NuxtLink :to="''">
					<i class="fa-brands fa-instagram"></i>
					@alpaca_tattoo
				</NuxtLink>
			</div>
		</div>
	</footer>
</template>

<style scoped>
.Footer {
	width: 100%;
	background-color: var(--color-main);
	position: absolute;
	bottom: 0;
	padding: 20px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}

.Guides__content,
.Social__content {
	margin-top: 5px;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.Social__content {
	align-items: flex-end;
}

span,
h4,
a,
i {
	color: var(--color-with-main);
	font-size: 1.1rem;
}

a {
	font-size: 1rem;
	display: flex;
	align-items: center;
	gap: 5px;
}

.Logo {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

img {
	width: 100%;
	height: 100px;
}

.Social {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

@media (max-width: 480px) {
	.Footer {
		padding: 20px 10px;
		gap: 10px;
	}

	span,
	h4,
	a,
	i {
		font-size: 0.9rem;
	}

	a {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}
}
</style>
