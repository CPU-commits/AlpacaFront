import type { ConfigFetch, DefaultResponse, Fetch } from '~/common/fetchModule'
import type { Toast } from '~/models/toast/toast.model'

export abstract class Service {
	private readonly fetchModule: Fetch
	protected readonly authStore = useAuthStore()
	private readonly toastsStore = useToastsStore()

	constructor(fetch: Fetch) {
		this.fetchModule = fetch
	}

	protected fetch<T = DefaultResponse>(
		config: Omit<ConfigFetch, 'token'>,
		omitToken = false,
	) {
		return this.fetchModule.fetchData<T>({
			...config,
			token: omitToken ? undefined : this.authStore.getToken,
		})
	}

	private handleError(error: unknown) {
		return this.fetchModule.handleError(error)
	}

	protected addToast(toast: Toast) {
		this.toastsStore.addToast(toast)
	}

	protected addErrorToast(error: unknown) {
		this.toastsStore.addToast({
			message: this.handleError(error).message,
			type: 'error',
		})
	}
}
