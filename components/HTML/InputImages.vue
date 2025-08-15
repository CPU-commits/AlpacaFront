<script lang="ts" setup>
import {
	PhDot,
	PhFilePlus,
	PhImages,
	PhMinus,
	PhImage,
} from '@phosphor-icons/vue'

const props = defineProps<{
	id: string
	label?: string
	image?: {
		image?: File | null
		source?: string
		provider?: string
	}
	single?: boolean
	validators?: {
		required?: boolean
		stage?: number
		namespace?: string
	}
	replaceImage?: boolean
	button?: {
		icon?: 'plus' | 'image'
		text?: string
	}
	maxFiles?: number
	clean?: boolean
}>()
// Stores
const toastsStore = useToastsStore()
// Composables
const formErrors = useFormErrors()
const forceErrors = useForceErrors()
// i18n
const { t } = useI18n()

const emit = defineEmits<{
	(e: 'update:images', v: Array<File>): void
}>()

const src = ref<Array<string>>([])
const images = ref<Array<File>>([])
const input = ref<HTMLInputElement | null>(null)
const currentSlide = ref(0)

watch(
	() => props.clean,
	(clean) => {
		if (clean) {
			images.value = []
			src.value = []
		}
	},
)

watch(
	images,
	(newImages) => {
		emit('update:images', newImages)
	},
	{ deep: true },
)

function loadImg(file: File) {
	const reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onload = (e: any) => {
		const target = e.target
		if (props.replaceImage) src.value = [target?.result?.toString() ?? '']
		else src.value.push(target?.result?.toString() ?? '')
	}
}

function handleInput() {
	const files = input.value?.files
	if (
		!props.replaceImage &&
		props.maxFiles &&
		files &&
		files.length + src.value.length > props.maxFiles
	) {
		useToastsStore().addToast({
			message: t('common.maxImages', {
				maxImages: props.maxFiles,
			}),
			type: 'error',
		})
		return
	}

	if (files)
		for (const file of files) {
			if (file.type.includes('img') || file.type.includes('image')) {
				loadImg(file)
				if (props.replaceImage) images.value = [file]
				else images.value.push(file)
				if (input.value) {
					input.value.files = null
					input.value.value = ''
				}
			} else {
				toastsStore.addToast({
					type: 'error',
					message: t('common.selectImage'),
				})
			}
		}
	validate(images.value, props.id, props.validators)
}

onMounted(() => {
	if (props.image?.image) loadImg(props.image?.image)
	if (props.validators && !formErrors.value.has(props.id)) {
		const hasErrors = validate(
			images.value,
			props.id,
			props.validators,
			true,
		)

		formErrors.value.set(props.id, {
			hasErrors: hasErrors ?? true,
			errors: [],
			stage: props.validators.stage,
			namespace: props.validators.namespace,
		})
	}
})

onUnmounted(() => {
	if (props.validators?.stage === undefined) formErrors.value.delete(props.id)
})

watch(forceErrors, (forceErrors) => {
	if (
		!forceErrors?.namespace ||
		forceErrors.namespace === props.validators?.namespace
	)
		validate(images.value, props.id, props.validators)
})
</script>

<template>
	<article class="Image">
		<label v-if="label" :for="id">{{ label }}</label>

		<section class="Image__Carousel">
			<figure
				v-if="src.length === 0 && !image?.source"
				class="Image__input"
			>
				<PhImages :size="30" />
			</figure>
			<div v-else-if="single && src.length > 0">
				<HTMLInvisibleButton
					:click="
						() => {
							images.splice(0, 1)
							src.splice(0, 1)
						}
					"
				>
					<PhMinus color="var(--color-text-with-main)" :size="20" />
				</HTMLInvisibleButton>

				<div class="Item__Slide--content">
					<img :src="src[0]" alt="" />
				</div>
			</div>
			<Carousel v-else-if="!image?.source" v-model="currentSlide">
				<Slide
					v-for="(srcImage, i) in src"
					:key="i"
					class="Item_Carousel--Slide"
				>
					<HTMLInvisibleButton
						:click="
							() => {
								currentSlide -= 1
								images.splice(i, 1)
								src.splice(i, 1)
							}
						"
					>
						<PhMinus
							color="var(--color-text-with-main)"
							:size="20"
						/>
					</HTMLInvisibleButton>

					<div class="Item__Slide--content">
						<img :src="srcImage" alt="" />
						<slot :index="i" />
					</div>
				</Slide>
			</Carousel>
			<NuxtImg
				v-if="image?.source"
				:src="image.source"
				:provider="image.provider"
			/>
			<div v-if="!single" class="Image__Carousel--slider">
				<PhDot
					v-for="(_, i) in images"
					:key="i"
					:color="
						i === currentSlide
							? 'var(--color-main)'
							: 'var(--color-text)'
					"
					:size="50"
				/>
			</div>
		</section>

		<HTMLInvisibleButton :click="() => input?.click()">
			<PhFilePlus
				v-if="!button || !button.icon || button.icon === 'plus'"
				:size="25"
			/>
			<PhImage v-else :size="25" />
			{{
				!button || !button.text
					? !replaceImage
						? $t('common.addImage')
						: $t('common.replaceImage')
					: button.text
			}}
		</HTMLInvisibleButton>
		<HTMLErrorMessage :id="id" />
		<input ref="input" type="file" @change="handleInput" />
	</article>
</template>

<style scoped lang="scss">
.Image {
	display: flex;
	flex-direction: column;
	gap: 10px;
	img {
		width: fit-content;
		object-fit: contain;
		max-height: 500px;
		border-radius: 8px;
		width: 100%;
	}
}

.Image__Carousel {
	border: 1px solid var(--color-light);
	padding: 10px;
	border-radius: 8px;
	.carousel {
		width: 100%;
	}
}

.Image__input {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
}

.Item_Carousel--Slide {
	position: relative;
	button {
		position: absolute;
		top: 5px;
		right: 5px;
	}
}

.Image__Carousel--slider {
	display: flex;
	justify-content: center;
}

.Item__Slide--content {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

input {
	display: none;
}

button {
	border: none;
	background-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
}
</style>
