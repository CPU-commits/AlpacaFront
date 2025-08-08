export type Payment = {
	id: number
	status: 'pending' | 'refused' | 'paid' | 'refunded'
	text?: string
	price: number
	updatedAt: string
	priceFormated: string
	currency: string
	createdAt: string
}
