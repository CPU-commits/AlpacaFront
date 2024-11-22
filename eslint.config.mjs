// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(eslintPluginPrettierRecommended).overrideRules({
	'@typescript-eslint/no-explicit-any': 'off',
	'vue/multi-word-component-names': 'off',
})
