<script lang="ts" setup>
import type { User } from '~/models/user/user.model'

const { filterUsers } = defineProps<{
	filterUsers?: Array<number>
}>()
// Form
const q = ref('')

let timeout: NodeJS.Timeout

const emit = defineEmits<{
	(e: 'selectUser', u: User): void
}>()
// Users
const users = ref<Array<User> | null>(null)
async function searchUsers() {
	users.value = await useNuxtApp().$userService.search(q.value, {
		filterUsers,
	})
}

watch(q, () => {
	if (timeout) clearTimeout(timeout)

	timeout = setTimeout(() => {
		searchUsers()
	}, 400)
})

function selectUser(user: User) {
	emit('selectUser', user)
}
</script>

<template>
	<div class="UsersSearch">
		<HTMLInput v-model:value="q" :label="$t('common.searchUser')" />

		<template v-if="users">
			<HTMLTable :header="[]">
				<tr v-for="user in users" :key="user.id">
					<td>
						<HTMLSimpleButton
							type="button"
							:hover="false"
							:click="() => selectUser(user)"
						>
							{{ user.name }}
						</HTMLSimpleButton>
					</td>
					<td>
						<HTMLSimpleButton
							type="button"
							:hover="false"
							:click="() => selectUser(user)"
						>
							{{ user.email }}
						</HTMLSimpleButton>
					</td>
					<td>
						<HTMLSimpleButton
							type="button"
							:hover="false"
							:click="() => selectUser(user)"
						>
							@{{ user.username }}
						</HTMLSimpleButton>
					</td>
				</tr>
			</HTMLTable>
			<p v-if="users.length === 0">{{ $t('common.usersEmpty') }}</p>
		</template>
	</div>
</template>

<style scoped>
.UsersSearch {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
