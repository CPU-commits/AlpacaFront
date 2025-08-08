<script setup lang="ts">
import { UserTypesKeys } from '~/models/user/user.model'
</script>

<template>
	<div class="Panel">
		<div class="Panel__content">
			<nav class="Panel__nav">
				<NuxtLink
					:to="`/${useAuthStore().getUsername}/config`"
					:class="{ Selected: $route.path.includes('/config') }"
				>
					<i class="fa-solid fa-address-card"></i>
					{{ $t('panel.profile') }}
				</NuxtLink>
				<NuxtLink
					:to="`/${useAuthStore().getUsername}/calendar`"
					:class="{ Selected: $route.path.includes('/calendar') }"
				>
					<i class="fa-solid fa-calendar-week"></i>
					{{
						useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)
							? $t('panel.calendar')
							: $t('panel.appointments')
					}}
				</NuxtLink>
				<NuxtLink
					v-if="
						useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)
					"
					:to="`/${useAuthStore().getUsername}/metrics`"
					:class="{ Selected: $route.path.includes('/metrics') }"
				>
					<i class="fa-solid fa-chart-simple"></i>
					{{ $t('panel.metrics') }}
				</NuxtLink>
				<NuxtLink
					v-if="
						useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)
					"
					:to="`/${useAuthStore().getUsername}/studios`"
					:class="{ Selected: $route.path.includes('/studios') }"
				>
					<i class="fa-solid fa-shop"></i>
					{{ $t('panel.studios') }}
				</NuxtLink>
				<NuxtLink
					:to="`/${useAuthStore().getUsername}/billing`"
					:class="{ Selected: $route.path.includes('/billing') }"
				>
					<i class="fa-solid fa-credit-card"></i>
					{{ $t('panel.billing') }}
				</NuxtLink>
				<button @click="() => useAuthStore().logOut()">
					<i class="fa-solid fa-arrow-right-from-bracket"></i>
					{{ $t('panel.logout') }}
				</button>
			</nav>

			<div class="Panel__content--slot">
				<slot />
			</div>
		</div>
	</div>
</template>

<style scoped>
.Panel {
	width: 100%;
}

.Panel__content {
	display: flex;
	padding: 20px;
	gap: 20px;
	width: 100%;
	justify-content: center;
}

a,
button {
	display: flex;
	align-items: center;
	gap: 10px;
	background-color: transparent;
	border: none;
	font-size: 1rem;
	text-wrap: nowrap;
	i {
		font-size: 1rem;
	}
}

.Selected {
	color: var(--color-second);
	i {
		color: var(--color-main);
	}
}

.Panel__nav {
	width: fit-content;
	padding: 10px;
	position: sticky;
	top: 10px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	height: fit-content;
}

.Panel__content--slot {
	width: 100%;
	display: flex;
	flex-direction: column;
	max-width: 800px;
	gap: 20px;
}
</style>
