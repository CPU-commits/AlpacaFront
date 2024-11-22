import { http, HttpResponse } from 'msw'

export const handlers = [
	http.get('http://localhost:8000/example', () => {
		return HttpResponse.json({
			id: 'example',
			firstName: 'example',
			lastName: 'example',
		})
	}),
]
