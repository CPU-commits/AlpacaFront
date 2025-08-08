// Services
import { AppointmentService } from '~/services/appointment'
import { AuthService } from '~/services/auth'
import { CodeService } from '~/services/code'
import { FollowService } from '~/services/follow'
import { DesignService } from '~/services/design'
import { PostService } from '~/services/post'
import { ProfileService } from '~/services/profile'
import { StudioService } from '~/services/studio'
import { TattooService } from '~/services/tattoo'
import { UserService } from '~/services/user'
import { Fetch } from '~~/common/fetchModule'
import { LinkService } from '~/services/link'
import { SubscriptionService } from '~/services/subscription'
import { PaymentService } from '~/services/payment'

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
			studioService: new StudioService(fetchModule),
			userService: new UserService(fetchModule),
			followService: new FollowService(fetchModule),
			designService: new DesignService(fetchModule),
			linkService: new LinkService(fetchModule),
			subscriptionService: new SubscriptionService(fetchModule),
			paymentService: new PaymentService(fetchModule),
		},
	}
})
