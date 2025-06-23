// Services
import { AppointmentService } from '~/services/appointment'
import { AuthService } from '~/services/auth'
import { CodeService } from '~/services/code'
import { PostService } from '~/services/post'
import { ProfileService } from '~/services/profile'
import { TattooService } from '~/services/tattoo'
import { Fetch } from '~~/common/fetchModule'

export default defineNuxtPlugin(() => {
	const fetchModule = new Fetch()
	return {
		provide: {
			fetchModule,
			codeService: new CodeService(fetchModule),
			authService: new AuthService(fetchModule),
			tattooService: new TattooService(fetchModule),
			profileService: new ProfileService(fetchModule),
			postService: new PostService(fetchModule),
			appointmentService: new AppointmentService(fetchModule),
		},
	}
})
