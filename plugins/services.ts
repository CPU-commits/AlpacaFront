// Services
import { Fetch } from '~~/common/fetchModule'

export default defineNuxtPlugin(() => {
	const fetchModule = new Fetch()
	return {
		provide: {
			fetchModule,
		},
	}
})
