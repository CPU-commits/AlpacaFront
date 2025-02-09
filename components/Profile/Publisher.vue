<script lang="ts" setup>
import type { Category } from '~/models/tattoo/category.model'
// i18n
const { t } = useI18n()
// Categories
const { categories } = defineProps<{
	categories: Array<Category>
}>()

const emit = defineEmits<{
	(e: 'uploadTattoo'): void
}>()
// Modal
const modalTag = ref(false)
// Data
const tattoos = ref<Array<File>>([])
const post = ref('')

// Form
const categoriesData = ref<
	Array<{
		id: number
		name: string
		slug: string
	}>
>([])
const filteredCategories = computed(() =>
	categories.filter(
		({ slug }) =>
			!categoriesData.value.some((category) => category.slug === slug),
	),
)
const tattoosDescriptions = ref<Array<string>>([])
const imageIsTattoo = ref<Array<boolean>>([])

watch(tattoos, (tattoos) => {
	if (selected.value === 1) tattoosDescriptions.value.length = tattoos.length
	else imageIsTattoo.value.length = tattoos.length
})
// Selected
const selected = ref(0)

async function uploadTattoos() {
	const success = await useNuxtApp().$tattooService.uploadTattoos(
		tattoos.value.map((image, i) => ({
			image: image,
			tags: categoriesData.value.map(({ id }) => id),
			description: tattoosDescriptions.value[i],
		})),
	)
	if (success) {
		categoriesData.value = []
		tattoos.value = []
		selected.value = 0

		useToastsStore().addToast({
			message: t('profile.publisher.successTattoos'),
			type: 'success',
		})
		emit('uploadTattoo')
	}
}

async function uploadPost() {
	const publication = await useNuxtApp().$postService.publish({
		content: post.value,
		idCategories: categoriesData.value.map(({ id }) => id),
		images: tattoos.value.map((image, i) => ({
			image,
			isTattoo: imageIsTattoo.value[i],
		})),
	})
	if (publication) {
		post.value = ''
		selected.value = 0
		tattoos.value = []
	}
}
</script>

<template>
	<section class="Publisher">
		<header class="Publisher__types">
			<button
				class="Publisher__types--type"
				:class="{ Selected: selected === 0 }"
				@click="() => (selected = 0)"
			>
				<i class="fa-solid fa-paper-plane"></i>
				<small>{{ $t('profile.publisher.publication') }}</small>
			</button>
			<button
				class="Publisher__types--type"
				:class="{ Selected: selected === 1 }"
				@click="() => (selected = 1)"
			>
				<i class="fa-solid fa-camera-retro"></i>
				<small>{{ $t('profile.publisher.tattoos') }}</small>
			</button>
		</header>
		<!-- Publication -->
		<HTMLForm v-if="selected === 0" :action="uploadPost">
			<HTMLTextArea
				:placeholder="$t('profile.publisher.what')"
				:value="post"
				@update:value="(val) => (post = val)"
			/>
			<HTMLInputImages id="images" v-model:images="tattoos" :size="true">
				<template #default="data">
					<HTMLSwitch
						:id="`isTattoo${data.index}`"
						v-model:checked="imageIsTattoo[data.index]"
						:label="$t('profile.publisher.isTattoo')"
					/>
				</template>
			</HTMLInputImages>
			<div class="Publisher__tags">
				<i class="fa-solid fa-tags"></i>
				<HTMLInvisibleButton :click="() => (modalTag = true)">
					<i class="fa-solid fa-plus"></i>
				</HTMLInvisibleButton>
				<small v-if="categoriesData.length === 0">
					<i>{{ $t('profile.publisher.noTags') }}</i>
				</small>
				<small
					v-for="(category, i) in categoriesData"
					v-else
					:key="i"
					class="Publisher__tags--tag"
				>
					<HTMLInvisibleButton
						:click="
							() => {
								categoriesData.splice(i, 1)
							}
						"
					>
						<i class="fa-solid fa-minus"></i>
					</HTMLInvisibleButton>
					{{ category.name }}
				</small>
			</div>

			<footer class="Publisher__footer">
				<HTMLButton type="submit">
					{{ $t('profile.publisher.publish') }}
				</HTMLButton>
			</footer>
		</HTMLForm>
		<!-- Tattoo -->
		<HTMLForm v-if="selected === 1" :action="uploadTattoos">
			<HTMLInputImages id="tattos" v-model:images="tattoos">
				<template #default="data">
					<HTMLTextArea
						id="tattoDescription"
						v-model:value="tattoosDescriptions[data.index]"
						:placeholder="$t('profile.publisher.description')"
						:validators="{ required: false, maxLength: 250 }"
					/>
				</template>
			</HTMLInputImages>

			<div class="Publisher__tags">
				<i class="fa-solid fa-tags"></i>
				<HTMLInvisibleButton :click="() => (modalTag = true)">
					<i class="fa-solid fa-plus"></i>
				</HTMLInvisibleButton>
				<small v-if="categoriesData.length === 0">
					<i>{{ $t('profile.publisher.noTags') }}</i>
				</small>
				<small
					v-for="(category, i) in categoriesData"
					v-else
					:key="i"
					class="Publisher__tags--tag"
				>
					<HTMLInvisibleButton
						:click="
							() => {
								categoriesData.splice(i, 1)
							}
						"
					>
						<i class="fa-solid fa-minus"></i>
					</HTMLInvisibleButton>
					{{ category.name }}
				</small>
			</div>
			<footer class="Publisher__footer">
				<HTMLButton type="submit">
					{{ $t('profile.publisher.publishTattoos') }}
				</HTMLButton>
			</footer>
		</HTMLForm>
		<!-- Modal -->
		<Modal v-model:opened="modalTag">
			<template #title>
				<h2>{{ $t('profile.publisher.tags') }}</h2>
			</template>
			<div class="Categories">
				<HTMLInvisibleButton
					v-for="category in filteredCategories"
					:key="category.id"
					:click="
						() => {
							categoriesData.push(category)
						}
					"
				>
					<i class="fa-solid fa-circle-plus"></i>
					{{ category.name }}
				</HTMLInvisibleButton>
			</div>
		</Modal>
	</section>
</template>

<style scoped lang="scss">
.Publisher {
	width: 100%;
}

.Publisher__types {
	display: flex;
	gap: 10px;
}

.Publisher__types--type {
	padding: 5px 8px;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	border: none;
	background-color: transparent;
	small,
	i {
		font-size: 0.8rem;
	}
}

.Publisher__tags {
	display: flex;
	gap: 15px;
	align-items: center;
	.fa-solid {
		color: var(--color-main);
	}
	button {
		background-color: var(--color-second);
		border-radius: 60%;
		width: 16px;
		height: 16px;
		.fa-solid {
			color: var(--color-text-with-second);
			font-size: 0.8rem;
		}
	}
}

.Publisher__tags--tag {
	background-color: var(--color-main);
	color: white;
	border-radius: 5px;
	padding: 2px 5px;
	button {
		background-color: transparent;
	}
}

.Categories {
	display: flex;
	gap: 20px;
	button {
		background-color: var(--color-main);
		i {
			color: white;
		}
		color: white;
		padding: 8px;
		border-radius: 5px;
		font-size: 1rem;
	}
}

.Publisher__footer {
	display: flex;
	gap: 10px;
	i {
		font-size: 1rem;
		color: var(--color-main);
	}
}

.Selected {
	background-color: var(--color-main);
	small,
	i {
		color: var(--color-with-main);
	}
}
</style>
