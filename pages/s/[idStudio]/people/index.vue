<script lang="ts" setup>
import {
	GIVE_ROLES_PERMISSION,
	JOIN_PEOPLE_PERMISSION,
	type StudioPermission,
} from '~/models/studio/permission.model'
import type { StudioPerson, StudioRole } from '~/models/studio/person.model'
import type { User } from '~/models/user/user.model'

definePageMeta({
	auth: true,
})

const idStudio = useRoute().params.idStudio as string

// Modals
const modalRoles = ref(false)
const modalAddAdmin = ref(false)
const modalDelete = ref(false)
// Form
const user = ref<null | User>(null)
const role = ref<StudioRole>('admin')
// Data
const { data, error } = await useAsyncData(
	async (app) => {
		return await Promise.all([
			app?.$studioService.getStudioPeople(parseInt(idStudio)),
			app?.$studioService.getStudioPermissions(),
		])
	},
	{ server: false },
)

function rolesToRoleSelected(roles: Array<StudioRole>) {
	const isAdmin = roles.includes('admin')
	const isTattooArtist = roles.includes('tattoo_artist')
	const isBoth = isAdmin && isTattooArtist

	return isBoth ? 'tattooArtist&admin' : isAdmin ? 'admin' : 'tattooArtist'
}

function roleSelectedToRoles(roleSelected: string) {
	const roles: Array<StudioRole> = []
	if (roleSelected.includes('tattooArtist')) roles.push('tattoo_artist')
	if (roleSelected.includes('admin')) roles.push('admin')

	return roles
}

function getPeople(people: Array<StudioPerson>) {
	return people.map((person) => ({
		...person,
		roleSelected: rolesToRoleSelected(person.roles),
	}))
}

const people = ref(getPeople(data.value?.[0] ?? []))
watch(data, (data) => {
	people.value = getPeople(data?.[0] ?? [])
})
const allPermissions = computed(() =>
	data.value?.[1]?.filter(({ permission }) =>
		useStudioPermissionsStore().userHasPermission(permission),
	),
)
const allPermissionsT = computed(() => {
	const traductions = new Map<StudioPermission, string>()
	allPermissions.value?.forEach(({ permission, t }) =>
		traductions.set(permission, t),
	)

	return traductions
})

const userPermissions = ref<null | { [x: StudioPermission]: boolean }>(null)
watch(user, (user) => {
	userPermissions.value = {}
	allPermissions.value?.forEach(
		({ permission }) =>
			((userPermissions.value as { [x: StudioPermission]: boolean })[
				permission
			] =
				people.value
					?.find(({ user: userAdmin }) => userAdmin.id === user?.id)
					?.permissions?.includes(permission) ?? false) as boolean,
	)
})

async function addPerson(user: User, role: StudioRole) {
	people.value?.push({
		user,
		idUser: user.id,
		permissions: [],
		idStudio: 0,
		roles: [role],
		roleSelected: rolesToRoleSelected([role]),
	})
	modalAddAdmin.value = false

	const success = await useNuxtApp().$studioService.join(
		parseInt(idStudio),
		user.id,
		role,
	)
	if (!success) {
		people.value = people.value?.filter(
			({ user: admin }) => admin.id !== user.id,
		)
	}
}

async function changeRoles(
	idUser: number,
	roles: Array<StudioRole>,
	oldRoles: Array<StudioRole>,
) {
	const success = await useNuxtApp().$studioService.changeRoles(
		parseInt(idStudio),
		idUser,
		roles,
	)
	if (!success) {
		people.value = people.value?.map((person) =>
			person.idUser === idUser
				? {
						...person,
						roles: oldRoles ?? [],
						roleSelected: rolesToRoleSelected(person.roles),
					}
				: person,
		)
	}
}

function setChecksPermissions(
	p: {
		permission: StudioPermission
		dependsOn?: Array<StudioPermission>
	},
	enabled: boolean,
) {
	if (enabled && p.dependsOn) {
		for (const key in userPermissions.value) {
			if (p.dependsOn.includes(key)) userPermissions.value[key] = enabled
		}
	} else if (!enabled) {
		const dependsOnMe = allPermissions.value
			?.filter(({ dependsOn }) => dependsOn?.includes(p.permission))
			.map(({ permission }) => permission)
		for (const key in userPermissions.value) {
			if (dependsOnMe?.includes(key)) userPermissions.value[key] = enabled
		}
	}
}

async function setPermission(
	idUser: number,
	permission: StudioPermission,
	enabled: boolean,
) {
	const success = await useNuxtApp().$studioService.setPermissions(
		parseInt(idStudio),
		idUser,
		{
			permission,
			enabled,
		},
	)
	if (!success && userPermissions.value) {
		userPermissions.value[permission] = !enabled
	}
}

async function removePerson(idUser: number) {
	const person = {
		...(people.value.find(
			({ idUser: id }) => id === idUser,
		) as StudioPerson & { roleSelected: string }),
	}
	people.value = people.value.filter(({ idUser: id }) => id !== idUser)
	modalDelete.value = false

	const success = await useNuxtApp().$studioService.removePerson(
		parseInt(idStudio),
		idUser,
	)
	if (!success) {
		people.value.push(person)
	}
}
</script>

<template>
	<NuxtLayout name="studio">
		<ErrorWrapper :errors="[error]">
			<header class="Access">
				<h2>{{ $t('studio.people.manage') }}</h2>
				<div
					v-if="
						useStudioPermissionsStore().userHasPermission(
							JOIN_PEOPLE_PERMISSION,
						)
					"
					class="Access__Buttons"
				>
					<HTMLButton
						type="button"
						:click="
							() => {
								modalAddAdmin = true
								role = 'admin'
							}
						"
					>
						{{ $t('studio.people.add') }}
					</HTMLButton>
					<HTMLButton
						type="button"
						:click="
							() => {
								modalAddAdmin = true
								role = 'tattoo_artist'
							}
						"
					>
						{{ $t('studio.people.addTattooArtist') }}
					</HTMLButton>
				</div>
			</header>
			<HTMLTable
				:header="[
					'',
					$t('studio.people.name'),
					$t('studio.people.username'),
					$t('studio.people.email'),
					$t('studio.people.roles'),
					$t('studio.people.permissions'),
					$t('studio.people.remove'),
				]"
			>
				<tr v-for="person in people" :key="person.idUser">
					<td>
						<ProfileAvatar
							:retrieve-avatar="{ idUser: person.user.id }"
							:box-shadow="false"
						/>
					</td>
					<td>{{ person.user.name }}</td>
					<td>{{ person.user.username }}</td>
					<td>{{ person.user.email }}</td>
					<td>
						<div
							v-if="
								person.roles.includes('owner') ||
								!useStudioPermissionsStore().isOwner
							"
							class="Roles"
						>
							<Categories
								:categories="
									person.roles.map((role) =>
										$t(`studio.people.${role}`),
									)
								"
								:with-tag="false"
							/>
						</div>
						<HTMLSelect
							v-else
							:id="`roles${person.idUser}`"
							v-model:value="person.roleSelected"
							@update:value-with-old-value="
								(selected) => {
									person.roles = roleSelectedToRoles(
										selected.value,
									)

									changeRoles(
										person.idUser,
										roleSelectedToRoles(selected.value),
										roleSelectedToRoles(selected.oldValue),
									)
								}
							"
						>
							<option value="tattooArtist">
								{{
									$t(
										'studio.people.rolesSelect.tattoo_artist',
									)
								}}
							</option>
							<option value="admin">
								{{ $t('studio.people.rolesSelect.admin') }}
							</option>
							<option value="tattooArtist&admin">
								{{
									$t(
										'studio.people.rolesSelect.adminAndTattooArtist',
									)
								}}
							</option>
						</HTMLSelect>
					</td>
					<td
						v-if="
							useStudioPermissionsStore().userHasPermission(
								GIVE_ROLES_PERMISSION,
							)
						"
					>
						<div
							v-if="person.roles.includes('admin')"
							class="Roles"
						>
							<HTMLSimpleButton
								type="button"
								:click="
									() => {
										modalRoles = true
										user = person.user
									}
								"
							>
								<i class="fa-solid fa-sliders"></i>
							</HTMLSimpleButton>
						</div>
						<i v-else class="fa-solid fa-square"></i>
					</td>
					<td v-else>
						<i class="fa-solid fa-table-cells-row-lock"></i>
					</td>
					<td v-if="!person.roles.includes('owner')">
						<div class="Roles">
							<HTMLSimpleButton
								type="button"
								:click="
									() => {
										modalDelete = true
										user = person.user
									}
								"
							>
								<i class="fa-solid fa-minus"></i>
							</HTMLSimpleButton>
						</div>
					</td>
					<td v-else>
						<i class="fa-solid fa-square"></i>
					</td>
				</tr>
			</HTMLTable>

			<!-- Modals -->
			<HorizontalModal v-model:opened="modalRoles">
				<template #title>
					<h2>
						{{
							$t('studio.people.userPermissions', {
								name: user?.name,
							})
						}}
					</h2>
				</template>
				<HTMLTable
					:header="[
						$t('studio.people.role'),
						$t('studio.people.roleEnabled'),
					]"
				>
					<tr
						v-for="permission in allPermissions"
						:key="permission.permission"
					>
						<td>
							<div class="RolesDepends">
								{{ permission.t }}
								<div
									v-for="p in permission.dependsOn"
									:key="p"
									class="RoleDepends"
								>
									<i class="fa-solid fa-arrow-turn-up"></i>
									{{ allPermissionsT.get(p) }}
								</div>
							</div>
						</td>
						<td v-if="userPermissions">
							<HTMLSwitch
								:id="`permission-${permission.permission}`"
								v-model:checked="
									userPermissions[permission.permission]
								"
								label=""
								@update:checked="
									(enabled) => {
										setChecksPermissions(
											permission,
											enabled,
										)
										setPermission(
											user?.id as number,
											permission.permission,
											enabled,
										)
									}
								"
							/>
						</td>
					</tr>
				</HTMLTable>
			</HorizontalModal>
			<Modal v-model:opened="modalAddAdmin">
				<template #title>
					<h2>{{ $t('studio.people.search') }}</h2>
				</template>
				<ProfileSearch
					:filter-users="people?.map(({ user: admin }) => admin.id)"
					@select-user="(user) => addPerson(user, role)"
				/>
			</Modal>
			<Modal v-model:opened="modalDelete">
				<template #title>
					<h2>Eliminar</h2>
				</template>
				<p class="Confirm">
					{{
						$t('studio.people.confirmDelete', { name: user?.name })
					}}
				</p>
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
						:click="() => removePerson(user?.id as number)"
					>
						{{ $t('studio.people.remove') }}
					</HTMLButton>
				</ModalButtons>
			</Modal>
		</ErrorWrapper>
	</NuxtLayout>
</template>

<style scoped lang="scss">
.Access {
	display: flex;
	padding-bottom: 10px;
	justify-content: space-between;
	align-items: center;
}

i {
	font-size: 1.2rem;
}

.Roles {
	display: flex;
	justify-content: center;
}

.Access__Buttons {
	display: flex;
	gap: 10px;
	button {
		width: fit-content;
	}
}

.Confirm {
	text-align: center;
	padding: 10px;
}

.RolesDepends {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.fa-arrow-turn-up {
	transform: rotate(90deg);
}

.RoleDepends {
	display: flex;
	align-items: center;
	gap: 10px;
	justify-content: center;
}
</style>
