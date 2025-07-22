<script lang="ts" setup>
import type { Media } from '~/models/studio/studio.model'

defineProps<{
	modalMedia: boolean
}>()
// Form
const media = reactive({
	type: '',
	link: '',
})

const emit = defineEmits<{
	(e: 'pushMedia', v: Media): void
	(
		e: 'updateMedia',
		v: {
			type: string
			link: string
		},
	): void
	(e: 'update:modalMedia', v: boolean): void
}>()

function addMedia() {
	emit('pushMedia', {
		...media,
		id: 0,
		typeMedia: media.type,
	})
	emit('updateMedia', {
		...media,
	})
	media.link = ''
	media.type = ''
	emit('update:modalMedia', false)
}
</script>

<template>
	<Modal
		:opened="modalMedia"
		@update:opened="(v) => $emit('update:modalMedia', v)"
	>
		<template #title>
			<h2>{{ $t('studio.profile.addMedia') }}</h2>
		</template>
		<HTMLForm :action="addMedia">
			<HTMLSelectWithIcons
				id="media"
				v-model:value="media.type"
				:label="$t('studio.profile.mediaType')"
				:options="[
					{
						text: 'WhatsApp',
						value: 'whatsapp',
						icon: 'fa-brands fa-whatsapp',
					},
					{
						icon: 'fa-solid fa-globe',
						text: 'Web',
						value: 'web',
					},
					{
						icon: 'fa-brands fa-square-x-twitter',
						text: 'X',
						value: 'x',
					},
					{
						icon: 'fa-brands fa-facebook',
						text: 'Facebook',
						value: 'facebook',
					},
					{
						icon: 'fa-brands fa-instagram',
						text: 'Instagram',
						value: 'instagram',
					},
				]"
				:validators="{
					required: true,
					namespace: 'media',
				}"
			/>
			<HTMLInput
				id="link"
				v-model:value="media.link"
				:label="$t('studio.profile.link')"
				:validators="{
					required: true,
					maxLength: 150,
					httpUrl: true,
					namespace: 'media',
				}"
			/>

			<span v-if="media.type === 'whatsapp'">
				{{ $t('studio.profile.suggestLink') }}
				<HTMLSimpleAnchor
					to="https://crear.wa.link/"
					rel="external"
					target="_blank"
				>
					https://crear.wa.link/
				</HTMLSimpleAnchor>
			</span>

			<HTMLButton type="submit">
				{{ $t('studio.profile.addSocialMedia') }}
			</HTMLButton>
		</HTMLForm>
	</Modal>
</template>
