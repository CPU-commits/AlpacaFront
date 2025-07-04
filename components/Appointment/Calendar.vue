<script setup lang="ts">
import { ScheduleXCalendar } from '@schedule-x/vue'
import { createCalendar, createViewWeek } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import type { Appointment } from '~/models/appointment/appointment.model'

const props = defineProps<{
	appointments: Array<Appointment>
}>()

const emit = defineEmits<{
	(e: 'showEvent', v: Appointment): void
	(e: 'update:range', v: { start: string; end: string }): void
}>()

const calendarApp = createCalendar({
	views: [createViewWeek()],
	locale: 'es-ES',
	callbacks: {
		onEventClick(e) {
			const appointment = props.appointments.find(({ id }) => id === e.id)

			if (appointment) emit('showEvent', appointment)
		},
		onRangeUpdate(range) {
			emit('update:range', range)
		},
	},
})

function addEvents(appointments: Array<Appointment>) {
	calendarApp.events.set(
		appointments.map((appointment) => ({
			id: appointment.id,
			description: appointment.description,
			start: formatDateYYYYMMDDHHMM(appointment.scheduledAt ?? ''),
			end: formatDateYYYYMMDDHHMM(appointment.finishedAt ?? ''),
			people: [appointment.user?.name ?? ''],
			_options: {
				additionalClasses: [
					appointment.status === 'scheduled'
						? 'EventScheduled'
						: 'EventFinished',
				],
			},
		})),
	)
}

onMounted(() => addEvents(props.appointments))
watch(() => props.appointments, addEvents)
</script>

<template>
	<div>
		<ScheduleXCalendar :calendar-app="calendarApp" />
	</div>
</template>

<style lang="scss">
:root {
	--sx-color-primary: var(--color-main);
}

.EventFinished {
	--sx-color-primary: var(--color-second);
	--sx-color-primary-container: #e2e2e2;
	--sx-color-on-primary-container: #353535;
}

.EventScheduled {
	--sx-color-primary: #3c1dc7;
	--sx-color-primary-container: rgb(229, 202, 255);
	--sx-color-on-primary-container: #3c1dc7;
}
</style>
