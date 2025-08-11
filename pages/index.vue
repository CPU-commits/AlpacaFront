<script lang="ts" setup>
// Search
const { data: plans } = useAsyncData(
	async (app) => {
		return await app?.$subscriptionService.getPlans({ all: true })
	},
	{ server: false },
)
</script>

<template>
	<section class="Main">
		<section class="Title">
			<Search />
			<header>
				<h1>
					<span class="Title__Main">{{ $t('banner.search') }}</span>
					<span class="Title__Main">{{ $t('banner.tatto') }}</span>
					<span class="Title__Main">{{ $t('banner.connect') }}</span>
					<img
						class="Title__Img"
						src="/img/alpaca.jpg"
						alt="Alpaca"
					/>
				</h1>

				<p>
					<strong>{{ $t('banner.community') }}</strong>
					{{ $t('banner.text') }}
				</p>
			</header>
		</section>
		<div class="Text">
			<h2>No te pasa que...</h2>
			<div class="Text__texts">
				<article class="Text__right">
					<img
						class="Text__img"
						src="@/assets/photos/chaos.jpg"
						alt="1"
					/>
					<p>
						¿te cuesta encontrar tatuadores
						<span class="Marked">vayan con tu estilo?</span>
					</p>
				</article>
				<article class="Text__left">
					<p>
						o quizás ¿te gustaría poder experimentar algo
						<span class="Marked">nuevo y diferente?</span>
					</p>
					<img
						class="Text__img"
						src="@/assets/photos/newStyle.jpg"
						alt="1"
					/>
				</article>
				<article class="Text__right">
					<img
						class="Text__img"
						src="@/assets/photos/unique.jpg"
						alt="1"
					/>
					<p>
						o tal vez, ¿eres un tatuador o estudo en busca de un
						sitio
						<span class="Marked"
							>SOLO para el mundo del tatuaje?</span
						>
					</p>
				</article>
				<article class="Text__left">
					<p>
						bueno, todo eso y mucho más, lo encuentras en un solo
						lugar, aquí en
						<span class="Marked">Alpaca Tattoo</span>
					</p>
					<img
						class="Text__img"
						src="@/assets/photos/alpaca.jpg"
						alt="1"
					/>
				</article>
			</div>
		</div>
		<div class="Slider">
			<h2>Sube tu alcance y haz que tus tatuajes lleguen</h2>
			<br />
			<div class="Slider__img">
				<div class="splitted">
					<img src="@/assets/illustrations/thanks.webp" alt="2" />
				</div>
				<div class="splitted">
					<img src="@/assets/illustrations/studios.webp" alt="3" />
				</div>
				<div class="splitted">
					<img src="@/assets/illustrations/stonks.webp" alt="4" />
				</div>
				<div class="break"></div>
				<div class="imgtext">
					<h3>¡Agenda!</h3>
					<p>Busca el tatuaje que mejor se adapte a ti</p>
				</div>
				<div class="imgtext">
					<h3>Abre tu estudio</h3>
					<p>
						Abre tu estudio personal o profesional y empieza a
						publicar tus tattoos
					</p>
				</div>
				<div class="imgtext">
					<h3>Mejora</h3>
					<p>Mejora tus métricas y alcance</p>
				</div>
			</div>
		</div>
		<div class="PlansSection">
			<h2>Planes para que funciones</h2>
			<Plans v-if="plans" :plans="plans" />
			<HTMLAnchorButton to="/guides/subscriptions">
				{{ $t('banner.plans') }}
			</HTMLAnchorButton>
		</div>
	</section>
</template>

<style scoped lang="scss">
.Main {
	margin-top: 30px;
	display: flex;
	flex-direction: column;
	padding: 20px;
	max-width: 900px;
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

.Title__Main {
	color: var(--color-second);
	display: block;
	line-height: 1.1;
	position: relative;
	transition: all 0.6s ease;
}

.Title__Img {
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

.Slider {
	padding: 30px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}

.Slider__img {
	align-items: flex-start;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
}

.splitted:first-child {
	clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);
}

.splitted:nth-child(2) {
	clip-path: polygon(20% 0, 100% 0, 80% 100%, 0 100%);
}

.splitted:nth-child(3) {
	clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
}

.splitted:not(:first-child) {
	margin-left: -6.5%;
}

.break {
	flex-basis: 100%;
	height: 0;
}

.Slider__img img {
	width: 300px;
	height: 400px;
	object-fit: cover;
	vertical-align: top;
}

.splitted:first-child img {
	border-bottom-left-radius: 10px;
	border-top-left-radius: 10px;
}

.splitted:nth-child(3) img {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}

.imgtext {
	display: flex;
	flex-direction: column;
	max-width: 250px;
	align-items: center;
	padding: 10px;
}

.imgtext h3 {
	font-size: 2rem;
	text-align: center;
}

.imgtext p {
	text-align: center;
}

.Text {
	border-top-right-radius: 15px;
	border-top-left-radius: 15px;
	background-color: var(--color-sec);
	min-height: 300px;
	padding: 20px;
	padding-bottom: 50px;
}

.Text h2 {
	margin-bottom: 20px;
}

.Text__texts {
	display: flex;
	flex-direction: column;
	gap: 30px;
}

.Text .Marked {
	color: var(--color-main);
	font-size: 1.3rem;
}

.Text__right {
	max-width: 70vw;
	display: flex;
	position: relative;
	gap: 20px;
	align-items: center;
}

.Text__left {
	max-width: 70vw;
	display: flex;
	position: relative;
	gap: 20px;
	align-items: center;
	align-self: flex-end;
}

.Text__left span {
	left: 0;
}

.Text__left .Text__img {
	transform: rotate(-5deg);
}

.Text p {
	font-size: 1.1rem;
	font-weight: bold;
}

.Text__img {
	border-radius: 10px;
	object-fit: cover;
	max-height: 250px;
	transform: rotate(5deg);
	transition: all 0.4s;
	filter: grayscale(1);
}

.Text__img:hover,
.Text__left .Text__img:hover {
	transform: rotate(0deg);
}

.PlansSection {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	a {
		font-size: 1.2rem;
	}
}
</style>
