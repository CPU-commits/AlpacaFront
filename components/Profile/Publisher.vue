<script lang="ts" setup>
// i18n
const { t } = useI18n()
// Categories

const emit = defineEmits<{
	(e: 'uploadTattoo'): void
}>()
// Data
const tattoos = ref<Array<File>>([])
const post = ref('')

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
			description: tattoosDescriptions.value[i],
		})),
	)
	if (success) {
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

			<footer class="Publisher__footer">
				<HTMLButton type="submit">
					{{ $t('profile.publisher.publishTattoos') }}
				</HTMLButton>
			</footer>
		</HTMLForm>
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
	flex-wrap: wrap;
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
