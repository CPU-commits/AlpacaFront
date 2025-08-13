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
					<span>{{ $t('panel.profile') }}</span>
				</NuxtLink>
				<NuxtLink
					:to="`/${useAuthStore().getUsername}/calendar`"
					:class="{ Selected: $route.path.includes('/calendar') }"
				>
					<i class="fa-solid fa-calendar-week"></i>
					<span>
						{{
							useAuthStore().userRoleIs(
								UserTypesKeys.TATTOO_ARTIST,
							)
								? $t('panel.calendar')
								: $t('panel.appointments')
						}}
					</span>
				</NuxtLink>
				<NuxtLink
					v-if="
						useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)
					"
					:to="`/${useAuthStore().getUsername}/metrics`"
					:class="{ Selected: $route.path.includes('/metrics') }"
				>
					<i class="fa-solid fa-chart-simple"></i>
					<span>
						{{ $t('panel.metrics') }}
					</span>
				</NuxtLink>
				<NuxtLink
					v-if="
						useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)
					"
					:to="`/${useAuthStore().getUsername}/studios`"
					:class="{ Selected: $route.path.includes('/studios') }"
				>
					<i class="fa-solid fa-shop"></i>
					<span>
						{{ $t('panel.studios') }}
					</span>
				</NuxtLink>
				<NuxtLink
					:to="`/${useAuthStore().getUsername}/billing`"
					:class="{ Selected: $route.path.includes('/billing') }"
				>
					<i class="fa-solid fa-credit-card"></i>
					<span>
						{{ $t('panel.billing') }}
					</span>
				</NuxtLink>
				<button @click="() => useAuthStore().logOut()">
					<i class="fa-solid fa-arrow-right-from-bracket"></i>
					<span>
						{{ $t('panel.logout') }}
					</span>
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
	padding: 10px;
	max-width: 800px;
	gap: 20px;
}

@media (max-width: 480px) {
	.Panel__nav {
		flex-direction: row;
		width: 100%;
		justify-content: center;
		position: relative;
		top: 0;
	}

	.Panel__content {
		flex-direction: column;
	}
}

@media (max-width: 768px) {
	a span,
	button span {
		display: none;
	}

	.Panel__content {
		gap: 10px;
	}
}
</style>
