<script lang="ts" setup>
import type { Media } from '~/models/studio/studio.model'

defineProps<{
	media: Array<Media>
	canDelete?: boolean
}>()

defineEmits<{
	(e: 'delete', v: number): void
}>()
// Modal
const modalDelete = ref(false)
// Form
const idMedia = ref(0)

const { t } = useI18n()

function copyLink(link: string) {
	navigator.clipboard
		.writeText(`${link}?from=${useRoute().fullPath}`)
		.then(() =>
			useToastsStore().addToast({
				message: t('studio.media.copy'),
				type: 'success',
				timeout: 1200,
			}),
		)
		.catch(() =>
			useToastsStore().addToast({
				message: t('tattoo.failShare'),
				type: 'error',
				timeout: 1200,
			}),
		)
}
</script>

<template>
	<section class="Media">
		<div v-for="(m, i) in media" :key="i" class="SMedia">
			<div class="Icon">
				<i
					v-if="m.typeMedia === 'instagram'"
					class="fa-brands fa-instagram"
				></i>
				<i
					v-else-if="m.typeMedia === 'whatsapp'"
					class="fa-brands fa-whatsapp"
				></i>
				<i
					v-else-if="m.typeMedia === 'facebook'"
					class="fa-brands fa-facebook"
				></i>
				<i
					v-else-if="m.typeMedia === 'x'"
					class="fa-brands fa-square-x-twitter"
				></i>
				<i
					v-else-if="m.typeMedia === 'web'"
					class="fa-solid fa-globe"
				></i>
			</div>

			<HTMLSimpleAnchor
				:to="`${m.link}?from=${$route.fullPath}`"
				rel="external"
				target="_blank"
			>
				{{ capitalizeFirstLetter(m.typeMedia) }}
				<i class="fa-solid fa-arrow-up-right-from-square"></i>
			</HTMLSimpleAnchor>

			<HTMLSimpleButton type="button" :click="() => copyLink(m.link)">
				<i class="fa-solid fa-copy"></i>
			</HTMLSimpleButton>
			<HTMLSimpleButton
				v-if="canDelete && m.id"
				type="button"
				:click="
					() => {
						idMedia = m.id
						modalDelete = true
					}
				"
			>
				<i class="fa-solid fa-trash"></i>
			</HTMLSimpleButton>
		</div>
		<Modal v-model:opened="modalDelete">
			<template #title>
				<h2>{{ $t('studio.media.delete') }}</h2>
			</template>
			<p>{{ $t('studio.media.messageDelete') }}</p>
			<br />

			<ModalButtons>
				<HTMLButton
					type="button"
					:without-background="true"
					:click="() => (modalDelete = false)"
				>
					{{ $t('common.cancel') }}
				</HTMLButton>
				<HTMLButton
					type="button"
					:click="
						() => {
							modalDelete = false
							$emit('delete', idMedia)
						}
					"
				>
					{{ $t('studio.media.confirmDelete') }}
				</HTMLButton>
			</ModalButtons>
		</Modal>
	</section>
</template>

<style scoped>
.Media {
	display: flex;
	justify-content: center;
	gap: 15px;
	flex-wrap: wrap;
}

.SMedia {
	justify-content: flex-end;
	display: flex;
	align-items: center;
	gap: 5px;
}

.Icon {
	background-color: var(--color-second);
	padding: 10px;
	border-radius: 100%;
	height: 35px;
	width: 35px;
	display: flex;
	align-items: center;
	justify-content: center;
	i {
		font-size: 1.2rem;
		color: var(--color-text-with-second);
	}
}

a {
	text-wrap: nowrap;
}

a i {
	font-size: 0.9rem;
}

button {
	padding-left: 5px;
	i {
		font-size: 0.9rem;
	}
}
</style>
