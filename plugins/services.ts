// Services
import { AuthService } from '~/services/auth'
import { PostService } from '~/services/post'
import { ProfileService } from '~/services/profile'
import { TattooService } from '~/services/tattoo'
import { Fetch } from '~~/common/fetchModule'

export default defineNuxtPlugin(() => {
	const fetchModule = new Fetch()
	return {
		provide: {
			fetchModule,
			authService: new AuthService(fetchModule),
			tattooService: new TattooService(fetchModule),
			profileService: new ProfileService(fetchModule),
			postService: new PostService(fetchModule),
		},
	}
})
