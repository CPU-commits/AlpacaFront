<script lang="ts" setup>
// Search
</script>

<template>
	<section class="Main">
		<section class="Title">
			<HTMLSearch :label="$t('search.tattoo')" />
			<header>
				<h1>
					<span>{{ $t('banner.search') }}</span>
					<span>{{ $t('banner.tatto') }}</span>
					<span>{{ $t('banner.connect') }}</span>
					<img src="/img/alpaca.jpg" alt="Alpaca" />
				</h1>

				<p>
					<strong>{{ $t('banner.community') }}</strong>
					{{ $t('banner.text') }}
				</p>
			</header>
			<nav>
				<HTMLAnchor href="/tatuadores">
					{{ $t('banner.tattoArtists') }}
				</HTMLAnchor>
				<HTMLAnchor href="/tatuadores">
					{{ $t('banner.goToSearch') }}
				</HTMLAnchor>
			</nav>
		</section>
	</section>
</template>

<style scoped lang="scss">
.Main {
	margin-top: 30px;
	display: flex;
	flex-direction: column;
}

h1 {
	text-align: right;
	font-size: 5rem;
	font-weight: 800;
	letter-spacing: -0.06em;
	margin: 0 0 16px;
	span {
		font-size: var(--font-title);
	}
}

.Red {
	background-color: red;
}

span {
	color: var(--color-second);
	display: block;
	font-size: 4rem;
	line-height: 1.1;
	position: relative;
	transition: all 0.6s ease;
}

img {
	margin-top: 10px;
	max-width: 500px;
	border-radius: 14px;
	transform: rotate(5deg);
	box-shadow: var(--box-shadow);
}

.Title {
	display: flex;
	flex-direction: column;
	align-items: center;
	header {
		display: flex;
		align-items: center;
		gap: 30px;
	}
	gap: 20px;
	nav {
		display: flex;
		gap: 30px;
	}
	p {
		color: var(--color-dark);
		max-width: 300px;
		text-align: center;
	}
	strong {
		color: var(--color-main);
	}
}
</style>
