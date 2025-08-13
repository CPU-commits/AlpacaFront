<script lang="ts" setup>
import { NuxtLayout } from '#components'
import { UserTypesKeys } from '~/models/user/user.model'

import type { Design } from '~/models/design/design.model'
import { SITE_URL } from '~/common/configs'

const authStore = useAuthStore()
const route = useRoute()

const nickname = route.params.nickname as string
const designs = ref<Array<Design>>([])

function onNewDesigns(newDesigns: Array<Design>) {
	designs.value.unshift(...newDesigns)
}

// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: t('design.metadata.title', { name: nickname }),
	description: t('design.metadata.description', { name: nickname }),
	ogType: 'website',
	ogImageType: 'image/jpeg',
	ogImage: {
		url: `${SITE_URL}/illustrations/designs.jpg`,
	},
	ogUrlPath: `/${nickname}/designs`,
	ogImageAlt: t('design.metadata.alt'),
})

useSeoMeta(seoMeta)
</script>

<template>
	<NuxtLayout name="design">
		<section class="Design_content">
			<ProfileTools
				:username="nickname"
				:is-tattoo-artist="
					authStore.userRoleIs(UserTypesKeys.TATTOO_ARTIST) ?? false
				"
			/>
			<DesignPublisher
				v-if="authStore.isOwnProfile"
				@upload-desing="onNewDesigns"
			/>
			<DesignDesigns
				v-model:designs="designs"
				:params="{ username: nickname }"
			/>
		</section>
	</NuxtLayout>
</template>

<style scoped lang="scss">
.Design_content {
	display: flex;
	gap: 16px;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
</style>
