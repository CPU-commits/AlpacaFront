<template>
	<section class="CalendarPage">
		<div class="CalendarPage__content">
			<h2>Citas agendadas</h2>

			<CalendarPrimary />
		</div>
	</section>
</template>

<style lang="scss">
.CalendarPage {
	width: 100%;
}

.CalendarPage__content {
	padding: 10px;
	h2 {
		text-align: center;
	}
}

.Calendar__calendar {
	.vc-day-content,
	.vc-title span {
		color: var(--color-black);
	}
	.vc-disabled {
		color: var(--color-dark);
	}
	button:not(:disabled) svg {
		stroke: var(--color-black);
	}
	button {
		background-color: transparent;
	}
}
</style>
