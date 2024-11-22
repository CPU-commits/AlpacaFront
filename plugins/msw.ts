// Worker
import { worker } from '../mocks/browser'

export default defineNuxtPlugin(() => {
	worker.start()
})
