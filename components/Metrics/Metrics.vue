<script lang="ts" setup>
import type { Publication } from '~/models/publication/publication.model'
import type { Media } from '~/models/studio/studio.model'

const { username, idStudio } = defineProps<{
	username?: string
	idStudio?: number
	media: Array<Media>
}>()
// i18n
const { t } = useI18n()
// Profile Metrics
const filtersMetrics = reactive({
	from: '',
	to: '',
	fromComparative: '',
	toComparative: '',
})

const { data: profileMetrics, error: errorProf } = useAsyncData(
	async (app) => {
		const metrics = username
			? app?.$profileService.getProfileMetrics(username, {
					from: filtersMetrics.from
						? formateDateISO(filtersMetrics.from)
						: undefined,
					to: filtersMetrics.to
						? formateDateISO(filtersMetrics.to)
						: undefined,
					toComparative: filtersMetrics.toComparative
						? formateDateISO(filtersMetrics.toComparative)
						: undefined,
					fromComparative: filtersMetrics.fromComparative
						? formateDateISO(filtersMetrics.fromComparative)
						: undefined,
				})
			: app?.$studioService.getStudioMetrics(idStudio as number, {
					from: filtersMetrics.from
						? formateDateISO(filtersMetrics.from)
						: undefined,
					to: filtersMetrics.to
						? formateDateISO(filtersMetrics.to)
						: undefined,
					toComparative: filtersMetrics.toComparative
						? formateDateISO(filtersMetrics.toComparative)
						: undefined,
					fromComparative: filtersMetrics.fromComparative
						? formateDateISO(filtersMetrics.fromComparative)
						: undefined,
				})

		return metrics
			?.then(({ views, follows }) => ({
				views: {
					location: views.byLocation.locations,
					countLocation: views.byLocation.count,
					time: {
						...views.byTime,
						data: [
							{
								name: t('metrics.profile.views'),
								data: views.byTime.stats.map(
									({ views }) => views,
								),
								color: '#ff0000',
							},
						],
						xAxisData:
							views.byTime.stats.map(({ day }) =>
								formateShortDateUTC(day),
							) ?? [],
					},
					timeComparative: {
						...views.byTimeComparative,
						data: [
							{
								name: t('metrics.profile.views'),
								data: views.byTimeComparative.stats.map(
									({ views }) => views,
								),
								color: '#ff0000',
							},
						],
						xAxisData:
							views.byTimeComparative.stats.map(({ day }) =>
								formateShortDateUTC(day),
							) ?? [],
					},
				},
				follows: {
					time: {
						...follows.byTime,
						data: [
							{
								name: t('metrics.profile.follows'),
								data: follows.byTime.stats.map(
									({ follows }) => follows,
								),
								color: '#564D4D',
							},
						],
						xAxisData:
							follows.byTime.stats.map(({ day }) =>
								formateShortDateUTC(day),
							) ?? [],
					},
					timeComparative: {
						...follows.byTimeComparative,
						data: [
							{
								name: t('metrics.profile.follows'),
								data: follows.byTimeComparative.stats.map(
									({ follows }) => follows,
								),
								color: '#564D4D',
							},
						],
						xAxisData:
							follows.byTimeComparative.stats.map(({ day }) =>
								formateShortDateUTC(day),
							) ?? [],
					},
				},
			}))
			.then((data) => ({
				...data,
				data: [data.views.time.data[0], data.follows.time.data[0]],
				xAxisData: data.views.time.xAxisData,
				dataC: [
					data.views.timeComparative.data[0],
					data.follows.timeComparative.data[0],
				],
				xAxisDataC: data.views.timeComparative.xAxisData,
			}))
	},
	{ server: false, watch: [filtersMetrics] },
)
const diffViewsProfile = computed(
	() =>
		(profileMetrics.value?.views.time.count ?? 0) -
		(profileMetrics.value?.views.timeComparative.count ?? 0),
)
const diffFollowsProfile = computed(
	() =>
		(profileMetrics.value?.follows.time.count ?? 0) -
		(profileMetrics.value?.follows.timeComparative.count ?? 0),
)
// Publication Metrics
const filtersPub = reactive({
	from: '',
	to: '',
})
const publication = ref<null | Publication>(null)

const { data: pubMetrics, error: errPub } = useAsyncData(
	async (app) => {
		if (!publication.value) return null

		const metrics = await app?.$postService.getMetricsPublication(
			publication.value.id,
			{
				from: filtersPub.from
					? formateDateISO(filtersPub.from)
					: undefined,
				to: filtersPub.to ? formateDateISO(filtersPub.to) : undefined,
			},
		)

		return {
			metrics,
			data: [
				{
					name: t('metrics.publications.likes'),
					data: metrics?.likes.stats.map(({ count }) => count) ?? [],
					color: '#ff0000',
				},
				{
					name: t('metrics.publications.views'),
					data: metrics?.views.stats.map(({ count }) => count) ?? [],
					color: '#564d4d',
				},
				{
					name: t('metrics.publications.shares'),
					data: metrics?.shares.stats.map(({ count }) => count) ?? [],
					color: '#18060c',
				},
			],
			xAxisData:
				metrics?.likes.stats.map(({ day }) =>
					formateShortDateUTC(day),
				) ?? [],
		}
	},
	{ immediate: false, watch: [publication, filtersPub] },
)
// Appointment metrics
const filtersApp = reactive({
	from: '',
	to: '',
})

const { data: appMetrics, error: errApp } = useAsyncData(
	async (app) => {
		return await app?.$appointmentService
			.getAppointmentsMetrics({
				from: filtersApp.from
					? formateDateISO(filtersApp.from)
					: undefined,
				to: filtersApp.to ? formateDateISO(filtersApp.to) : undefined,
				idStudio,
			})
			.then((data) => ({
				data: [
					{
						name: t('metrics.appointments.appointments'),
						data: data.map(({ count }) => count),
						color: '#18060c',
					},
				],
				xAxisData: data.map(({ status }) =>
					t(`calendar.statuses.${status}`),
				),
			}))
	},
	{ watch: [filtersApp], server: false },
)
// Links metrics
const filtersMedia = reactive({
	from: '',
	to: '',
	toComparative: '',
	fromComparative: '',
	idLink: 0,
})

const { data: mediaMetrics, error: errMedia } = useAsyncData(
	async (app) => {
		if (filtersMedia.idLink === 0) return null

		return await app?.$linkService
			.getLinkMetrics(filtersMedia.idLink, {
				from: filtersMedia.from
					? formateDateISO(filtersMedia.from)
					: undefined,
				to: filtersMedia.to
					? formateDateISO(filtersMedia.to)
					: undefined,
				toComparative: filtersMedia.toComparative
					? formateDateISO(filtersMedia.toComparative)
					: undefined,
				fromComparative: filtersMedia.fromComparative
					? formateDateISO(filtersMedia.fromComparative)
					: undefined,
				idStudio,
			})
			.then((data) => ({
				data: [
					{
						name: t('metrics.media.media'),
						data: data.byTime.stats.map(({ views }) => views),
						color: '#18060c',
					},
				],
				xAxisData: data.byTime.stats.map(({ day }) =>
					formateShortDateUTC(day),
				),
				count: data.byTime.count,
				countC: data.byTimeComparative.count,
				dataC: [
					{
						name: t('metrics.media.media'),
						data: data.byTimeComparative.stats.map(
							({ views }) => views,
						),
						color: '#18060c',
					},
				],
				xAxisDataC: data.byTimeComparative.stats.map(({ day }) =>
					formateShortDateUTC(day),
				),
			}))
	},
	{ watch: [filtersMedia], server: false, immediate: false },
)
const diffViewsMedia = computed(
	() => (mediaMetrics.value?.count ?? 0) - (mediaMetrics.value?.countC ?? 0),
)
</script>

<template>
	<ErrorWrapper :errors="[errPub, errorProf, errApp, errMedia]">
		<!--
		<Illustration
			illustration="stonks"
			:margin-top="false"
			:text="$t('metrics.are')"
		/>
		-->
		<h3>{{ $t('metrics.profile.profile') }}</h3>
		<section class="Filters">
			<HTMLInput
				v-model:value="filtersMetrics.fromComparative"
				:label="$t('metrics.profile.fromComparative')"
				type="date"
			/>
			<HTMLInput
				v-model:value="filtersMetrics.toComparative"
				:label="$t('metrics.profile.toComparative')"
				type="date"
			/>
			<i class="fa-solid fa-code-compare"></i>
			<HTMLInput
				v-model:value="filtersMetrics.from"
				:label="$t('metrics.profile.from')"
				type="date"
			/>
			<HTMLInput
				v-model:value="filtersMetrics.to"
				:label="$t('metrics.profile.to')"
				type="date"
			/>
		</section>
		<ChartLine
			v-if="profileMetrics?.data"
			:title="$t('metrics.profile.metrics')"
			:data="profileMetrics.data"
			:x-axis-data="profileMetrics.xAxisData"
		/>
		<div v-if="profileMetrics" class="Counts">
			<div class="Count">
				<i class="fa-solid fa-eye"></i>
				<span>{{ profileMetrics?.views.time.count }}</span>
			</div>
			<div class="Count">
				<i
					v-if="diffViewsProfile >= 0"
					class="fa-solid fa-arrow-trend-up"
				></i>
				<i v-else class="fa-solid fa-arrow-trend-down"></i>
				<i class="fa-solid fa-eye"></i>
				<span>{{ diffViewsProfile }}</span>
			</div>
			<div class="Count">
				<i class="fa-solid fa-user-plus"></i>
				<span>{{ profileMetrics?.follows.time.count }}</span>
			</div>
			<div class="Count">
				<i
					v-if="diffViewsProfile >= 0"
					class="fa-solid fa-arrow-trend-up"
				></i>
				<i v-else class="fa-solid fa-arrow-trend-down"></i>
				<i class="fa-solid fa-user-plus"></i>
				<span>{{ diffFollowsProfile }}</span>
			</div>
		</div>
		<ChartLine
			v-if="profileMetrics?.dataC"
			:title="$t('metrics.profile.metricsComparative')"
			:data="profileMetrics?.dataC"
			:x-axis-data="profileMetrics.xAxisDataC"
		/>
		<div v-if="profileMetrics" class="Counts">
			<div class="Count">
				<i class="fa-solid fa-eye"></i>
				<span>{{ profileMetrics?.views.timeComparative.count }}</span>
			</div>
			<div class="Count">
				<i class="fa-solid fa-user-plus"></i>
				<span>{{ profileMetrics?.follows.timeComparative.count }}</span>
			</div>
		</div>
		<ChartGlobal
			v-if="profileMetrics?.views.location"
			:data="
				profileMetrics.views.location.map(({ value, location }) => ({
					value,
					name: location,
				}))
			"
			map="santiago"
			:title="$t('metrics.profile.metricsLocation')"
			:item="$t('metrics.profile.views')"
		/>
		<div v-if="profileMetrics" class="Counts">
			<div class="Count">
				<i class="fa-solid fa-eye"></i>
				<span>{{ profileMetrics?.views.countLocation }}</span>
			</div>
		</div>

		<h3>{{ $t('metrics.publications.publications') }}</h3>
		<div class="Publications">
			<SelectPublication
				v-model:publication="publication"
				:params="{ username, idStudio }"
				:label="$t('metrics.publication')"
			/>
			<Publication v-if="publication" :post="publication" only-show />
			<section v-if="pubMetrics" class="Filters">
				<HTMLInput
					v-model:value="filtersPub.from"
					:label="$t('metrics.publications.from')"
					type="date"
				/>
				<HTMLInput
					v-model:value="filtersPub.to"
					:label="$t('metrics.publications.to')"
					type="date"
				/>
			</section>
			<ChartLine
				v-if="pubMetrics"
				:title="$t('metrics.publications.metrics')"
				:data="pubMetrics.data"
				:x-axis-data="pubMetrics.xAxisData"
			/>
			<div v-if="pubMetrics" class="Counts">
				<div class="Count">
					<i class="fa-solid fa-heart"></i>
					<span>{{ pubMetrics?.metrics?.likes.count }}</span>
				</div>
				<div class="Count">
					<i class="fa-solid fa-share"></i>
					<span>{{ pubMetrics?.metrics?.shares.count }}</span>
				</div>
				<div class="Count">
					<i class="fa-solid fa-eye"></i>
					<span>{{ pubMetrics?.metrics?.views.count }}</span>
				</div>
			</div>
		</div>

		<h3>{{ $t('metrics.appointments.appointments') }}</h3>
		<section class="Filters">
			<HTMLInput
				v-model:value="filtersApp.from"
				:label="$t('metrics.appointments.from')"
				type="date"
			/>
			<HTMLInput
				v-model:value="filtersApp.to"
				:label="$t('metrics.appointments.to')"
				type="date"
			/>
		</section>
		<ChartBar
			v-if="appMetrics"
			:data="appMetrics.data"
			:x-axis-data="appMetrics.xAxisData"
			:title="$t('metrics.appointments.metrics')"
		/>

		<h3>{{ $t('metrics.media.media') }}</h3>
		<StudioMedia
			:media="media ?? []"
			can-select-metrics
			@metrics="(idLink) => (filtersMedia.idLink = idLink)"
		/>

		<section class="Filters">
			<HTMLInput
				v-model:value="filtersMedia.fromComparative"
				:label="$t('metrics.media.fromComparative')"
				type="date"
			/>
			<HTMLInput
				v-model:value="filtersMedia.toComparative"
				:label="$t('metrics.media.toComparative')"
				type="date"
			/>
			<i class="fa-solid fa-code-compare"></i>
			<HTMLInput
				v-model:value="filtersMedia.from"
				:label="$t('metrics.media.from')"
				type="date"
			/>
			<HTMLInput
				v-model:value="filtersMedia.to"
				:label="$t('metrics.media.to')"
				type="date"
			/>
		</section>
		<ChartLine
			v-if="mediaMetrics?.data"
			:title="$t('metrics.media.metrics')"
			:data="mediaMetrics.data"
			:x-axis-data="mediaMetrics.xAxisData"
		/>
		<div v-if="mediaMetrics" class="Counts">
			<div class="Count">
				<i class="fa-solid fa-eye"></i>
				<span>{{ mediaMetrics.count }}</span>
			</div>
			<div class="Count">
				<i
					v-if="diffViewsMedia >= 0"
					class="fa-solid fa-arrow-trend-up"
				></i>
				<i v-else class="fa-solid fa-arrow-trend-down"></i>
				<i class="fa-solid fa-eye"></i>
				<span>{{ diffViewsMedia }}</span>
			</div>
		</div>
		<ChartLine
			v-if="mediaMetrics?.dataC"
			:title="$t('metrics.media.metricsComparative')"
			:data="mediaMetrics?.dataC"
			:x-axis-data="mediaMetrics.xAxisDataC"
		/>
		<div v-if="mediaMetrics" class="Counts">
			<div class="Count">
				<i class="fa-solid fa-eye"></i>
				<span>{{ mediaMetrics?.countC }}</span>
			</div>
		</div>
		<Empty
			v-if="media && media.length === 0"
			:text="$t('studio.media.addMedia')"
			:margin-top="false"
		/>
	</ErrorWrapper>
</template>

<style scoped lang="scss">
.Publications {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.Filters {
	display: flex;
	gap: 10px;
	align-items: center;
	flex-wrap: wrap;
	justify-content: center;
}

.Counts {
	display: flex;
	gap: 10px;
	justify-content: center;
}

.Count {
	width: 100%;
	max-width: 300px;
	border: 1px solid var(--color-light);
	padding: 10px;
	border-radius: 8px;
	display: flex;
	justify-content: center;
	gap: 10px;
	align-items: center;
	transition: all 0.4s ease;
}

.Count:hover {
	box-shadow: var(--box-shadow);
	border: 1px solid transparent;
	i {
		color: var(--color-main);
	}
}
</style>
