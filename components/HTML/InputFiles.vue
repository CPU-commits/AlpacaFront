<script lang="ts" setup>
import {
	PhFilePlus,
	PhFiles,
	PhFileXls,
	PhFileVideo,
	PhFileImage,
	PhFile,
	PhFileText,
	PhX,
} from '@phosphor-icons/vue'

const { validators, id, files } = withDefaults(
	defineProps<{
		size?: boolean
		label?: string
		id: string
		buttons?: boolean
		multiple?: boolean
		validators?: {
			required?: boolean
			filter?: {
				mime: RegExp
				message: string
			}
			maxFiles?: number
		}
		files?: Array<File>
	}>(),
	{
		size: false,
		label: '',
		buttons: true,
		multiple: false,
		validators: () => ({}),
		files: () => [],
	},
)

// Form
const onClickFiles = ref(() => {})
// Data
const filesFiles = ref<Array<File>>(files)
const filesData = ref<Array<{ type: string; name: string }>>(
	files.map((file) => ({ type: file.type, name: file.name })),
)
// Styles
const onSide = ref(false)

// Emits
const emit = defineEmits<{
	(e: 'onClickFiles', v: () => void): void
	(e: 'update:files', v: Array<File>): void
}>()
// Composables
const formErrors = useFormErrors()
const forceErrors = useForceErrors()

onMounted(() => {
	if (validators && !formErrors.value.has(id)) {
		const hasErrors = validate(true)

		formErrors.value.set(id, {
			hasErrors: hasErrors ?? true,
			errors: [],
		})
	}
})

onUnmounted(() => {
	formErrors.value.delete(id)
})

watch(onClickFiles, (newOnClickFiles) => {
	emit('onClickFiles', newOnClickFiles)
})

watch(filesFiles.value, (newfilesFiles) => {
	emit('update:files', newfilesFiles)
	validate()
})

function handleFiles(files: Array<File>) {
	if (
		(validators.maxFiles &&
			files.length + filesFiles.value.length <= validators.maxFiles) ||
		!validators.maxFiles
	)
		files.forEach(addFile)
	else
		useToastsStore().addToast({
			message: `La cantidad máxima de archivos es ${validators.maxFiles}`,
			type: 'error',
		})
}

function addDroppedFiles(e: DragEvent) {
	onSide.value = false
	e.preventDefault()
	// Process
	if (e.dataTransfer?.items) {
		;[...e.dataTransfer.items].forEach((item) => {
			if (item.kind === 'file') {
				const file = item.getAsFile()
				if (file?.type.includes('image')) addFile(file)
			}
		})
	}
}

function addFile(file: File) {
	filesData.value.push({
		type: file.type,
		name: file.name,
	})
	// Update files
	filesFiles.value.push(file)
}

function deleteFile(index: number) {
	filesData.value.splice(index, 1)
	filesFiles.value.splice(index, 1)
}

function validate(returnMode = false) {
	const inputRegistered = formErrors.value.get(id)
	if (!inputRegistered && !returnMode) return
	if (inputRegistered) inputRegistered.errors = []

	let hasErrors = false
	if (validators?.required && filesFiles.value.length === 0) {
		if (!returnMode && inputRegistered)
			inputRegistered.errors.push(minLength(1))

		hasErrors = true
	}

	if (!returnMode && inputRegistered) inputRegistered.hasErrors = hasErrors
	else return hasErrors
}

watch(forceErrors, () => {
	validate()
})
</script>

<template>
	<div class="InputFiles">
		<label v-if="label && label !== ''" :for="id">
			{{ label }}
		</label>
		<!-- Drag and drop -->
		<div
			class="InputFiles__drag-drop"
			:class="{ On: onSide, small: size, normal: !size }"
			@drop="(e) => addDroppedFiles(e)"
			@dragover="
				(e) => {
					e.preventDefault()
					onSide = true
				}
			"
			@dragleave="() => (onSide = false)"
		>
			<PhFiles v-if="filesData.length === 0" />
			<div v-for="(file, i) in filesData" v-else :key="i" class="File">
				<PhFileText v-if="file.type.includes('word')" />
				<PhFileXls v-else-if="file.type.includes('excel')" />
				<PhFileVideo v-else-if="file.type.includes('video')" />
				<PhFileImage v-else-if="file.type.includes('image')" />
				<PhFile v-else />
				{{ file.name }}
				<HTMLInvisibleButton :click="() => deleteFile(i)">
					<PhX color="white" height="15" />
				</HTMLInvisibleButton>
			</div>
		</div>
		<footer v-if="buttons" class="Buttons">
			<HTMLSimpleButton type="button" :click="onClickFiles">
				<PhFilePlus />
				<span v-if="!multiple"> Subir documento</span>
				<span v-else> Subir documentos</span>
			</HTMLSimpleButton>
		</footer>

		<HTMLInvisibleInputFile
			:id="id"
			:multiple="multiple"
			:on-change="handleFiles"
			:filter="
				validators?.filter
					? {
							message: validators.filter.message,
							type: validators.filter.mime,
						}
					: undefined
			"
			@on-click="(onClick) => (onClickFiles = onClick)"
		/>
		<HTMLErrorMessage :id="id" />
	</div>
</template>

<style scoped>
.InputFiles {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.fa-braille {
	font-size: 2rem;
}

.normal {
	min-height: 150px;
	gap: 20px;
	padding: 8px;
	img {
		width: 150px;
		height: 150px;
		object-fit: cover;
		border-radius: 8px;
	}
}
.small {
	min-height: 75px;
	gap: 25px;
	padding: 4px;
	img {
		width: 75px;
		height: 75px;
		object-fit: cover;
		border-radius: 8px;
	}
}
.InputFiles__drag-drop {
	border: 3px dotted var(--color-light);
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 8px;
	align-items: center;
	flex-wrap: wrap;
}

.On {
	border: 3px dotted var(--color-main);
}

.File {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px;
	i {
		font-size: 2rem;
	}
	button {
		position: absolute;
		top: -5px;
		right: -5px;
		background-color: var(--color-main);
		border-radius: 60%;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		i {
			font-size: 1rem;
			color: white;
		}
	}
}
</style>
