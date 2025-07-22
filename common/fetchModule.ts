// Modules
import { v4 as uuidv4 } from 'uuid'
// Types
import type { FetchError } from 'ofetch'
import { capitalizeFirstLetter } from '~~/utils/format'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum HTTPMethods {
	'post',
	'put',
	'get',
	'delete',
	'patch',
}

export interface ConfigFetch {
	method: keyof typeof HTTPMethods
	URL: string
	replaceBaseURL?: string
	body?: BodyInit | null | undefined | Record<string, any>
	spinnerStatus?: boolean
	headers?: HeadersInit
	token?: string | null
	nuxt?: boolean
	// Abort is for all same URLs
	abort?: {
		url?: string
		onChangePath?: boolean
	}
	blockConcurrentFetch?: boolean
	params?: { [x: string]: unknown }
	signal?: AbortSignal
	responseType?: 'blob' | 'text' | 'json' | 'stream' | 'arrayBuffer'
	scopeSpinner?: string
	returnHeaders?: boolean
}

export type DefaultResponse = {
	type?: string
	title?: string
	headers: Headers
	errors?: Array<{
		message: string
		metadata: { [x: string]: any }
	}>
}

export type ErrorFetch = {
	success: boolean
	message: string
	statusCode: number
}

export class BlockConcurrentError extends Error {}

export const ERROR_ABORT = 'The user aborted a request'

export class Fetch {
	private publicApi: string | undefined
	// string: URL, Array: currentFetchController
	private currentFetch: Map<
		string,
		Array<{
			id: string
			controller: AbortController
			path: string
			config: ConfigFetch
		}>
	> = new Map()

	private counters: {
		counterFetch: number
		counterGetFetch: number
	} = new Proxy(
		{ counterFetch: 0, counterGetFetch: 0 },
		{
			set(obj, prop, value) {
				if (prop === 'counterFetch' || prop === 'counterGetFetch') {
					obj[prop] = value

					if (prop === 'counterFetch' && value === 0)
						useSpinner().value = false
					if (prop === 'counterGetFetch' && value === 0)
						useSpinnerGet().value = false
				}
				return true
			},
		},
	)

	private readonly spinner: Ref<boolean> | undefined
	private readonly spinnerGet: Ref<boolean> | undefined
	private readonly scopeSpinner: Ref<Map<string, boolean>> | undefined
	// Route
	private path = useRoute().path

	constructor() {
		if (!import.meta.server) {
			this.spinner = useSpinner()
			this.spinnerGet = useSpinnerGet()
			this.scopeSpinner = useScopeSpinner()

			this.watchPath()
		}
	}

	private generateFetchId(): string {
		return `fetch_id_${uuidv4()}`
	}

	isFetchError(error: unknown): error is FetchError {
		return (
			typeof error === 'object' &&
			error !== null &&
			('message' in error || 'data' in error)
		)
	}

	private watchPath() {
		useRouter().beforeEach((to) => {
			this.path = to.path

			this.currentFetch.forEach((fetchController, url) => {
				fetchController.forEach(({ id, controller, path }) => {
					if (
						path !== this.path &&
						controller.signal &&
						!controller.signal.aborted
					) {
						const config = this.currentFetch
							.get(url)
							?.find((f) => f.id === id)
						if (config?.config.abort?.onChangePath)
							controller.abort()
					}
				})
			})

			return true
		})
	}

	/**
	 * Handles errors in fetch request
	 * @param error The error to handle
	 * @param save Indicates wheter the error should be saved in the error store
	 * @returns An ErrorFetch object with information about the error
	 */
	handleError(error: unknown): ErrorFetch {
		let errorFetch: ErrorFetch

		if (this.isFetchError(error)) {
			const message =
				error.data?.title ?? error.data?.body?.title ?? error.message
			errorFetch = {
				success: false,
				message: capitalizeFirstLetter(message),
				statusCode: error.response?.status ?? 500,
			}
		} else if (error instanceof Error) {
			errorFetch = {
				success: false,
				message: capitalizeFirstLetter(error.message),
				statusCode: 500,
			}
		} else {
			errorFetch = {
				success: false,
				message: 'fetch',
				statusCode: 500,
			}
		}
		return errorFetch
	}

	private isFetchExecuting(key: string) {
		return (this.currentFetch.get(key)?.length ?? 0) > 0
	}

	private getFetch({
		method,
		body,
		nuxt,
		token,
		responseType,
		signal,
		headers,
		returnHeaders,
		replaceBaseURL,
	}: ConfigFetch) {
		if (!this.publicApi) {
			const config = useRuntimeConfig()
			this.publicApi = config.public.API
		}
		return $fetch.create({
			baseURL: !nuxt
				? !replaceBaseURL
					? this.publicApi
					: replaceBaseURL
				: undefined,
			parseResponse: responseType === 'blob' ? undefined : JSON.parse,
			responseType,
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
				...headers,
			},
			method,
			body,
			signal,
			onRequestError({ request, error }) {
				// Log error
				console.log(`[fetch request error] ${request} ${error}`)
			},
			onResponseError({ request, response }) {
				// Log response
				console.log('[fetch response error]', request, response.body)
			},
			onResponse({ response }) {
				if (returnHeaders && response._data !== undefined)
					response._data = {
						body: response._data,
						headers: response.headers,
					}
			},
			mode: 'cors',
		})
	}

	/**
	 * Removes a fetch from the list of current requests
	 * @param id The ID of the fetch to remove
	 * @param counters Counters to reduce in one for GET and non-GET requests
	 * @param key The key of the fetch request in the currentFetch map. (URL)
	 * @param scopeSpinner Optional. The scope of the spinner
	 */
	private popFetch(
		id: string,
		counters: { get: boolean; fetch: boolean },
		key: string,
		scopeSpinner?: string,
	) {
		if (counters.get) this.counters.counterGetFetch -= 1
		if (counters.fetch) this.counters.counterFetch -= 1

		const index = this.currentFetch.get(key)?.findIndex((f) => f.id === id)
		this.currentFetch.get(key)?.splice(index ?? 0, 1)
		if (scopeSpinner) this.scopeSpinner?.value.delete(scopeSpinner)
	}

	private isNotEmptyArray(value: unknown): boolean {
		if (typeof value === 'object' && value instanceof Array)
			return value.length !== 0

		return true
	}

	/**
	 * Performs a fetch request and returns the response
	 * @param config The configuration of the fetch request
	 * @returns A promise with the response from the fetch request
	 */
	async fetchData<T = DefaultResponse>(config: ConfigFetch): Promise<T> {
		// Add Params
		if (config.params) {
			let hasQuery = config.URL.includes('?')
			for (const [key, value] of Object.entries(config.params).filter(
				([_, value]) =>
					value !== undefined && this.isNotEmptyArray(value),
			)) {
				config.URL += `${hasQuery ? '&' : '?'}${key}=${value}`
				hasQuery = true
			}
		}

		const key = config.URL.split('?')[0]
		// Block fetch
		if (config.blockConcurrentFetch && this.isFetchExecuting(key))
			throw new BlockConcurrentError()
		// Abort all fetchs
		const abortKey = config.abort?.url === 'same' ? key : config?.abort?.url
		if (
			config.abort &&
			config.abort?.url &&
			this.isFetchExecuting(abortKey ?? '')
		) {
			const struct = this.currentFetch.get(abortKey ?? '')
			struct?.forEach((c) => {
				c.controller.abort()
			})
			struct?.splice(0, struct.length)
		}
		// Id
		const id = this.generateFetchId()
		// Controller signal
		const controller = new AbortController()
		config.signal = controller.signal

		if (this.currentFetch.has(key)) {
			this.currentFetch.get(key)?.push({
				id,
				controller,
				path: this.path,
				config,
			})
		} else {
			this.currentFetch.set(key, [
				{ id, controller, path: this.path, config },
			])
		}
		// Create fetch
		const apiFetch = this.getFetch(config)

		// Scope fetch
		if (!config.scopeSpinner) config.scopeSpinner = 'default'
		this.scopeSpinner?.value.set(config.scopeSpinner, true)

		// Methods
		if (config.method !== 'get' || config.spinnerStatus) {
			if (this.spinner?.value) this.spinner.value = true
			this.counters.counterFetch += 1
		}
		if (config.method === 'get') {
			if (this.spinnerGet?.value) this.spinnerGet.value = true
			this.counters.counterGetFetch += 1
		}

		const dataFetch = await apiFetch<T & DefaultResponse>(config.URL).catch(
			(err) => {
				if (!import.meta.server)
					this.popFetch(
						id,
						{
							get: config.method === 'get',
							fetch:
								config.method !== 'get' ||
								(config.spinnerStatus ?? false),
						},
						key,
						config.scopeSpinner,
					)
				throw err
			},
		)
		if (!import.meta.server)
			this.popFetch(
				id,
				{
					get: config.method === 'get',
					fetch:
						config.method !== 'get' ||
						(config.spinnerStatus ?? false),
				},
				key,
				config.scopeSpinner,
			)
		return dataFetch as T & DefaultResponse
	}
}
