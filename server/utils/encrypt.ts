import Cryptr from 'cryptr'

// Instance cryptr
const {
	cookies: { CRYPTO_KEY },
} = useRuntimeConfig()
const cryptr = new Cryptr(CRYPTO_KEY)

export function encrypt(value: string) {
	return cryptr.encrypt(value)
}

export function decrypt(value: string) {
	return cryptr.decrypt(value)
}
