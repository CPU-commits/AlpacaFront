<script lang="ts" setup>
import type { Design } from '~/models/tattoo/design.model'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
	(e: 'upload-desing', design: Array<Design>): void
}>()

const designs = ref<File[]>([])
const designsDescriptions = ref<string[]>([])
const designsPrices = ref<string[]>([])
const selected = ref<number>(0)
const clean = ref<boolean>(false)

watch(designs, (files) => {
	if (selected.value === 1) {
		designsDescriptions.value.length = files.length
		designsPrices.value.length = files.length
	}
})

async function uploadDesigns() {
	const payload = designs.value.map((file, i) => ({
		image: file,
		description: designsDescriptions.value[i] ?? '',
		price: designsPrices.value[i] ?? 0,
	}))

	const createdDesigns =
		await useNuxtApp().$designService.uploadDesigns(payload)

	if (createdDesigns) {
		designs.value = []
		designsDescriptions.value = []
		designsPrices.value = []
		selected.value = 0
		clean.value = true
		setTimeout(() => (clean.value = false), 0)

		useToastsStore().addToast({
			message: t('design.publisher.successDesign'),
			type: 'success',
		})

		emit('upload-desing', createdDesigns)
	}
}
</script>

<template>
	<section class="Publisher">
		<HTMLForm :action="uploadDesigns">
			<HTMLInputImages
				id="designs"
				v-model:images="designs"
				:clean="clean"
			>
				<template #default="{ index }">
					<HTMLTextArea
						id="designDescription"
						v-model:value="designsDescriptions[index]"
						:placeholder="$t('design.publisher.description')"
						:validators="{ required: false, maxLength: 250 }"
					/>
					<HTMLInput
						v-model:value="designsPrices[index]"
						type="number"
						:placeholder="$t('design.publisher.price')"
					/>
				</template>
			</HTMLInputImages>

			<footer class="Publisher__footer">
				<HTMLButton type="submit">
					{{ $t('design.publisher.publishDesign') }}
				</HTMLButton>
			</footer>
		</HTMLForm>
	</section>
</template>

<style scoped lang="scss">
.Publisher {
	width: 60%;
}

.Publisher__footer {
	display: flex;
	gap: 10px;
	i {
		font-size: 1rem;
		color: var(--color-main);
	}
}
</style>
