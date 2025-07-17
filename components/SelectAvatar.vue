<script setup lang="ts">
type User = {
	id: number
	email?: string
	avatar?: string
	name: string
	retrieveAvatar?: number
}

const {
	users,
	validators,
	id,
	canSelectRecommend = true,
} = defineProps<{
	id: string
	users: Array<User>
	label: string
	canSelectRecommend?: boolean
	validators?: {
		required: boolean
		stage?: number
		namespace?: string
	}
}>()

const emit = defineEmits<{
	(e: 'update:user', v: User | null): void
}>()
// Values
const isOpen = ref(false)
const selectedAny = ref(false)
const selectedUser = ref<null | User>(null)
const searchQuery = ref('')
// Composables
const formErrors = useFormErrors()
const forceErrors = useForceErrors()

onMounted(() => {
	if (validators && !formErrors.value.has(id)) {
		const hasErrors = validate(
			!selectedAny.value ? null : {},
			id,
			validators,
			true,
		)

		formErrors.value.set(id, {
			hasErrors: hasErrors ?? true,
			errors: [],
			stage: validators.stage,
			namespace: validators.namespace,
		})
	}
})

onUnmounted(() => {
	if (validators?.stage === undefined) formErrors.value.delete(id)
})

watch(forceErrors, (forceErrors) => {
	if (
		!forceErrors?.namespace ||
		forceErrors.namespace === validators?.namespace
	)
		validate(!selectedAny.value ? null : {}, id, validators)
})

const filteredUsers = computed(() => {
	if (!searchQuery.value) return users

	const query = searchQuery.value.toLowerCase()
	return users.filter(
		(user) =>
			user.name.toLowerCase().includes(query) ||
			user.email?.toLowerCase().includes(query),
	)
})

// Métodos
const toggleDropdown = () => {
	isOpen.value = !isOpen.value
	if (isOpen.value) {
		searchQuery.value = ''
	}
}

const closeDropdown = () => {
	isOpen.value = false
	searchQuery.value = ''
}

const selectUser = (user: User) => {
	selectedUser.value = user
	selectedAny.value = true
	closeDropdown()
	validate({}, id, validators)
	emit('update:user', user)
}

const unselectUser = () => {
	selectedUser.value = null
	selectedAny.value = true
	closeDropdown()
	validate({}, id, validators)
	emit('update:user', null)
}

const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && isOpen.value) {
		closeDropdown()
	}
}

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
	<div :id="id" class="form-group">
		<label class="form-label">{{ label }}</label>

		<!-- Select Trigger -->
		<div class="select-wrapper">
			<button
				type="button"
				class="select-trigger"
				:class="{ 'select-trigger--open': isOpen }"
				@click="toggleDropdown"
			>
				<div v-if="!selectedUser" class="user-display">
					<div class="user-info">
						<span>{{
							!selectedAny
								? $t('common.selectUser')
								: $t('common.recommendUser')
						}}</span>
					</div>
				</div>
				<div v-else class="user-display">
					<div class="avatar-container">
						<ProfileAvatar
							:avatar="selectedUser.avatar"
							:box-shadow="false"
							:retrieve-avatar="{
								idUser: selectedUser.retrieveAvatar,
							}"
							size="s"
						/>
					</div>
					<div class="user-info">
						<span class="user-name">{{ selectedUser.name }}</span>
						<span class="user-email">{{ selectedUser.email }}</span>
					</div>
				</div>
				<svg
					class="chevron-icon"
					:class="{ 'chevron-icon--rotated': isOpen }"
					viewBox="0 0 24 24"
				>
					<path d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
				</svg>
			</button>

			<!-- Dropdown -->
			<div v-if="isOpen" class="dropdown">
				<!-- Search Input -->
				<div class="search-container">
					<div class="search-wrapper">
						<svg class="search-icon" viewBox="0 0 24 24">
							<path
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
						<input
							v-model="searchQuery"
							type="text"
							:placeholder="$t('common.searchAvatar')"
							class="search-input"
						/>
					</div>
				</div>

				<!-- User List -->
				<div class="user-list">
					<div v-if="filteredUsers.length === 0" class="no-results">
						{{ $t('common.noUsersAvatar') }}
					</div>
					<button
						v-if="canSelectRecommend"
						type="button"
						class="user-item"
						:class="{
							'user-item--selected': !selectedUser && selectedAny,
						}"
						@click="unselectUser"
					>
						<div class="user-info">
							<span class="user-name">{{
								$t('common.recommendUser')
							}}</span>
						</div>
						<svg
							v-if="!selectedUser && selectedAny"
							class="check-icon"
							viewBox="0 0 24 24"
						>
							<path d="M5 13l4 4L19 7"></path>
						</svg>
					</button>
					<button
						v-for="user in filteredUsers"
						:key="user.id"
						type="button"
						class="user-item"
						:class="{
							'user-item--selected': selectedUser?.id === user.id,
						}"
						@click="selectUser(user)"
					>
						<div class="avatar-container">
							<ProfileAvatar
								:avatar="user.avatar"
								:box-shadow="false"
								:retrieve-avatar="{
									idUser: user.retrieveAvatar,
								}"
								size="s"
							/>
						</div>
						<div class="user-info">
							<span class="user-name">{{ user.name }}</span>
							<span class="user-email">{{ user.email }}</span>
						</div>
						<svg
							v-if="selectedUser?.id === user.id"
							class="check-icon"
							viewBox="0 0 24 24"
						>
							<path d="M5 13l4 4L19 7"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
		<HTMLErrorMessage :id="id" />

		<!-- Overlay -->
		<div v-if="isOpen" class="overlay" @click="closeDropdown"></div>
	</div>
</template>

<style scoped>
.form-group {
	margin-bottom: 0.5rem;
}

.form-label {
	display: block;
	margin-bottom: 0.5rem;
}

/* Select wrapper */
.select-wrapper {
	position: relative;
}

.select-trigger {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem;
	border: 1px solid var(--color-light);
	border-radius: 8px;
	background: white;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 1rem;
}

.select-trigger:hover {
	background: #f9fafb;
	border-color: #9ca3af;
}

.select-trigger:focus {
	outline: none;
	border-color: var(--color-second);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-trigger--open {
	border-color: var(--color-second);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Usuario display */
.user-display {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.user-info {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.user-name {
	font-weight: 500;
	color: var(--color-second);
	font-size: 0.875rem;
}

.user-email {
	font-size: 0.75rem;
	color: #6b7280;
}

/* Avatar */
.avatar-container {
	position: relative;
}

.avatar-container--large {
	width: 2.5rem;
	height: 2.5rem;
}

.avatar {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
}

.avatar--large {
	width: 100%;
	height: 100%;
}

.avatar-fallback {
	width: 100%;
	height: 100%;
	background: var(--color-second);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 0.75rem;
	font-weight: 500;
}

.avatar-fallback--large {
	font-size: 0.875rem;
}

/* Chevron icon */
.chevron-icon {
	width: 1rem;
	height: 1rem;
	color: #9ca3af;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
	transition: transform 0.2s ease;
}

.chevron-icon--rotated {
	transform: rotate(180deg);
}

/* Dropdown */
.dropdown {
	position: absolute;
	z-index: 10;
	width: 100%;
	margin-top: 0.25rem;
	background: white;
	border: 1px solid var(--color-light);
	border-radius: 8px;
	box-shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
	animation: dropdownSlide 0.2s ease-out;
}

@keyframes dropdownSlide {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Search */
.search-container {
	padding: 0.5rem;
	border-bottom: 1px solid #e5e7eb;
}

.search-wrapper {
	position: relative;
}

.search-icon {
	position: absolute;
	left: 0.75rem;
	top: 50%;
	transform: translateY(-50%);
	width: 1rem;
	height: 1rem;
	color: #9ca3af;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.search-input {
	width: 100%;
	padding: 0.5rem 0.75rem 0.5rem 2.25rem;
	border: 1px solid var(--color-light);
	border-radius: 6px;
	font-size: 0.875rem;
	transition: border-color 0.2s ease;
}

.search-input:focus {
	outline: none;
	border-color: var(--color-second);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* User list */
.user-list {
	max-height: 15rem;
	overflow-y: auto;
}

.no-results {
	padding: 1rem;
	text-align: center;
	color: #6b7280;
	font-size: 0.875rem;
}

.user-item {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	border: none;
	background: none;
	cursor: pointer;
	transition: background-color 0.2s ease;
	text-align: left;
}

.user-item:hover {
	background: #f3f4f6;
}

.user-item:focus {
	outline: none;
	background: #f3f4f6;
}

.user-item--selected {
	background: #eff6ff;
}

.check-icon {
	width: 1rem;
	height: 1rem;
	color: var(--color-second);
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
	margin-left: auto;
}

/* Selected info */
.selected-info {
	margin-top: 1.5rem;
	padding: 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	background: #f9fafb;
}

.selected-title {
	font-weight: 600;
	margin-bottom: 0.5rem;
	color: var(--color-second);
	font-size: 0.875rem;
}

.selected-user {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.selected-details {
	display: flex;
	flex-direction: column;
}

.selected-name {
	font-weight: 500;
	color: var(--color-second);
	margin: 0 0 0.25rem 0;
}

.selected-email {
	font-size: 0.875rem;
	color: #4b5563;
	margin: 0 0 0.25rem 0;
}

.selected-id {
	font-size: 0.75rem;
	color: #6b7280;
	margin: 0;
}

/* Overlay */
.overlay {
	position: fixed;
	inset: 0;
	z-index: 5;
	background: rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
	.app-container {
		padding: 1rem;
	}

	.select-container {
		padding: 1.5rem;
	}
}
</style>
