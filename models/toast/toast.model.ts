import type { ToastType } from './toast_type.model'

export interface Toast {
	message: string
	type: keyof typeof ToastType
	dismissible?: boolean
	timeout?: number
}
