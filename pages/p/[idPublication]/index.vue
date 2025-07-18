<script lang="ts" setup>
const idPublication = parseInt(useRoute().params.idPublication as string)

const { data, status } = useAsyncData(
	async (app) => {
		return await app?.$postService.getPublication(idPublication)
	},
	{
		server: false,
	},
)
</script>

<template>
	<section class="P">
		<Publication v-if="data" :post="data" />
		<PublicationSkeleton v-if="status === 'pending'" />
	</section>
</template>

<style scoped>
.P {
	width: 100%;
}
</style>
