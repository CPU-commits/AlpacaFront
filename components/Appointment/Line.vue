<script lang="ts" setup>
const props = defineProps<{
	createdAt: string
	scheduledAt?: string
	status: string
}>()
// State
const state = ref(0)

function setState() {
	if (props.status === 'created') state.value = 0
	else if (props.status === 'scheduled') state.value = 1
	else if (props.status === 'finished') state.value = 2
	else if (props.status === 'reviewed') state.value = 3
	else if (props.status === 'canceled') state.value = -1
}

onMounted(setState)
watch(() => props.status, setState)
</script>

<template>
	<div class="AppointmentLine">
		<template v-if="state !== -1">
			<div class="State">
				<i v-if="state >= 0" class="fa-solid fa-circle"></i>
				<i v-else class="fa-regular fa-circle"></i>
				<small>{{ $t('calendar.statuses.created') }}</small>
				<small>{{ formatMiniDate(createdAt) }}</small>
			</div>
			<div class="TimeLine" :class="{ TimeLine__Colored: state > 0 }" />
			<div class="State">
				<i v-if="state >= 1" class="fa-solid fa-circle"></i>
				<i v-else class="fa-regular fa-circle"></i>
				<small>{{ $t('calendar.statuses.scheduled') }}</small>
				<small v-if="scheduledAt">{{
					formatMiniDate(scheduledAt)
				}}</small>
			</div>
			<div class="TimeLine" :class="{ TimeLine__Colored: state > 1 }" />
			<div class="State">
				<i v-if="state >= 2" class="fa-solid fa-circle"></i>
				<i v-else class="fa-regular fa-circle"></i>
				<small>{{ $t('calendar.statuses.finished') }}</small>
			</div>
			<div class="TimeLine" :class="{ TimeLine__Colored: state > 2 }" />
			<div class="State">
				<i v-if="state >= 3" class="fa-solid fa-circle"></i>
				<i v-else class="fa-regular fa-circle"></i>
				<small>{{ $t('calendar.statuses.reviewed') }}</small>
			</div>
		</template>
		<div v-else class="State">
			<i class="fa-solid fa-ban"></i>
			<small>{{ $t('calendar.statuses.canceled') }}</small>
		</div>
	</div>
</template>

<style scoped lang="scss">
.AppointmentLine {
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	position: relative;
}

.TimeLine {
	height: 2px;
	width: 100%;
	background-color: #e5e7eb;
	transform: translateY(-50%);
}

.TimeLine__Colored {
	background-color: var(--color-main);
}

.State {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	width: 100%;
}

.AppointmentState {
	.fa-solid {
		color: var(--color-black);
	}
	.Selected .fa-solid {
		color: var(--color-main) !important;
	}
}

.fa-solid {
	color: var(--color-main);
}

@media (max-width: 767.98px) {
	.State {
		i {
			font-size: 0.9rem;
		}
		small {
			font-size: 0.7rem;
		}
	}
}

@media (max-width: 575.98px) {
	.AppointmentLine {
		flex-wrap: wrap;
		gap: 5px;
	}
	.State {
		i {
			font-size: 0.8rem;
		}
	}
}
</style>
