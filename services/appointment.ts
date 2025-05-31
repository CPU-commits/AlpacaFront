import { BlockConcurrentError } from '~/common/fetchModule'
import { Service } from './service'
import type { Appointment } from '~/models/appointment/appointment.model'
import type { BodyHeaders } from '~/models/body.model'

export class AppointmentService extends Service {
	async getAppointments(params?: { page?: number }) {
		return await this.fetch<BodyHeaders<Array<Appointment>>>({
			method: 'get',
			URL: '/api/appointments',
			returnHeaders: true,
			params,
		}).then(({ body, headers }) => ({
			appointments: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}

	async requestAppointment(
		appointment: {
			phone?: string
			hasIdea: boolean
			area?: string
			height?: string
			width?: string
			color?: string
			description: string
			images?: Array<File>
		},
		idTattooArtist: number,
	) {
		try {
			throwIfFormHasError()
			const formData = new FormData()
			formData.set('idTattooArtist', idTattooArtist.toString())
			formData.set('description', appointment.description)
			formData.set('hasIdea', appointment.hasIdea ? 'true' : 'false')
			if (appointment.phone) formData.set('phone', appointment.phone)
			if (appointment.area) formData.set('area', appointment.area)
			if (appointment.height) formData.set('height', appointment.height)
			if (appointment.width) formData.set('width', appointment.width)
			if (appointment.color) formData.set('color', appointment.color)
			if (appointment.images)
				appointment.images.forEach((image) =>
					formData.append('images', image),
				)

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
}
