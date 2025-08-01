import { BlockConcurrentError } from '~/common/fetchModule'
import { Service } from './service'
import type { Appointment } from '~/models/appointment/appointment.model'
import type { BodyHeaders } from '~/models/body.model'
import dayjs from 'dayjs'
import type { AppointmentMetric } from '~/models/appointment/metric.model'

export class AppointmentService extends Service {
	async getAppointments(params?: {
		page?: number
		paginated?: boolean
		statuses?: Array<string>
		from?: string
		to?: string
		idStudio?: number
		allAppointments?: boolean
	}) {
		return await this.fetch<BodyHeaders<Array<Appointment> | null>>({
			method: 'get',
			URL: '/api/appointments',
			returnHeaders: true,
			params,
		}).then(({ body, headers }) => ({
			appointments: body ?? [],
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}

	async getCountPendingAppointments(params?: { idStudio?: number }) {
		return await this.fetch<{ count: number }>({
			method: 'get',
			URL: '/api/appointments/pendingCount',
			params,
		}).then(({ count }) => count)
	}

	async getAppointmentsMetrics(params?: {
		from?: string
		to?: string
		idStudio?: number
	}) {
		return await this.fetch<Array<AppointmentMetric>>({
			method: 'get',
			URL: '/api/appointments/metrics',
			params,
		})
	}

	async requestAppointment(
		appointment: {
			phone?: string
			hasIdea: boolean
			hasDesign: boolean
			area?: string
			height?: string
			width?: string
			idDesign?: number
			color?: string
			description: string
			images?: Array<File>
		},
		to: { idTattooArtist?: number; idStudio?: number },
	) {
		try {
			throwIfFormHasError()
			const formData = new FormData()
			if (to.idTattooArtist)
				formData.set('idTattooArtist', to.idTattooArtist.toString())
			if (to.idStudio) formData.set('idStudio', to.idStudio.toString())

			formData.set('description', appointment.description)
			formData.set('hasIdea', appointment.hasIdea ? 'true' : 'false')
			formData.set('hasDesign', appointment.hasDesign ? 'true' : 'false')
			if (appointment.phone) formData.set('phone', appointment.phone)
			if (appointment.area) formData.set('area', appointment.area)
			if (appointment.height) formData.set('height', appointment.height)
			if (appointment.width) formData.set('width', appointment.width)
			if (appointment.color) formData.set('color', appointment.color)
			if (appointment.images)
				appointment.images.forEach((image) =>
					formData.append('images', image),
				)
			if (appointment.idDesign)
				formData.set('idDesign', appointment.idDesign.toString())
			await this.fetch({
				method: 'post',
				URL: '/api/appointments',
				body: formData,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null
			this.addErrorToast(err)

			return false
		}
	}

	async cancelAppointment(idAppointment: number) {
		try {
			await this.fetch({
				method: 'patch',
				URL: `/api/appointments/${idAppointment}/cancel`,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}

	async reviewAppointment(
		idAppointment: number,
		review: { stars: number; review: string },
	) {
		try {
			throwIfFormHasError(`appointment-${idAppointment}`)
			await this.fetch({
				method: 'post',
				URL: `/api/appointments/${idAppointment}/review`,
				body: review,
				blockConcurrentFetch: true,
			})

			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}

	async assignTattooArtist(idAppointment: number, idTattooArtist: number) {
		try {
			throwIfFormHasError('assign')
			await this.fetch({
				method: 'patch',
				URL: `/api/appointments/${idAppointment}/assignTattooArtist/${idTattooArtist}`,
				blockConcurrentFetch: true,
			})

			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}

	async scheduleAppointment(
		schedule: {
			scheduledAt: string
			finishedAt?: string
		},
		idAppointment: number,
	) {
		try {
			throwIfFormHasError()
			const scheduledAt = new Date(`${schedule.scheduledAt}:00`)
			let finishedAt: string | undefined

			if (schedule.finishedAt) {
				const [hour, minutes] = schedule.finishedAt
					.split(':')
					.map(Number)

				finishedAt = dayjs(scheduledAt.toISOString())
					.hour(hour)
					.minute(minutes)
					.second(0)
					.toISOString()
			}

			await this.fetch({
				method: 'patch',
				URL: `/api/appointments/${idAppointment}/schedule`,
				body: {
					scheduledAt: scheduledAt.toISOString(),
					finishedAt,
				},
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}
}
