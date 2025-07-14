<script lang="ts" setup>
// Route
const nickname = useRoute().params.nickname as string

if (!useAuthStore().isAuth) {
	useRouter().push(`/register?to-calendar=${nickname}`)
}
// i18n
const { t } = useI18n()

// Data
const { data } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$profileService.getProfile(nickname)])
})
const profile = ref(data.value?.[0])
// Form
const appointment = reactive({
	phone: '',
	hasIdea: false,
	area: '',
	height: '',
	width: '',
	color: '',
	description: '',
	images: [] as Array<File>,
})
const areas = [
	{ name: t('calendar.form.areas.arm'), value: 'arm' },
	{ name: t('calendar.form.areas.leg'), value: 'leg' },
	{ name: t('calendar.form.areas.back'), value: 'back' },
	{ name: t('calendar.form.areas.chest'), value: 'chest' },
	{ name: t('calendar.form.areas.abdomen'), value: 'abdomen' },
	{ name: t('calendar.form.areas.neck'), value: 'neck' },
	{ name: t('calendar.form.areas.head'), value: 'head' },
	{ name: t('calendar.form.areas.hand'), value: 'hand' },
	{ name: t('calendar.form.areas.foot'), value: 'foot' },
	{ name: t('calendar.form.areas.hip'), value: 'hip' },
	{ name: t('calendar.form.areas.other'), value: 'other' },
]

async function requestAppointment() {
	const success = await useNuxtApp().$appointmentService.requestAppointment(
		{
			phone: appointment.phone !== '' ? appointment.phone : undefined,
			hasIdea: appointment.hasIdea,
			area: appointment.area !== '' ? appointment.area : undefined,
			height: appointment.height !== '' ? appointment.height : undefined,
			width: appointment.width !== '' ? appointment.width : undefined,
			color: appointment.color !== '' ? appointment.color : undefined,
			description: appointment.description,
			images: appointment.images,
		},
		profile.value?.idUser as number,
	)
	if (success) {
		useToastsStore().addToast({
			message: t('calendar.form.success'),
			type: 'success',
		})
		useRouter().push(`${useAuthStore().getUsername}/calendar`)
	}
}
</script>

<template>
	<MinimalForm :action="requestAppointment">
		<template #title>
			<ProfileAvatar :avatar="profile?.avatar?.key" />
			<h3>
				{{ $t('calendar.addWith', { nickname: nickname }) }}
			</h3>
		</template>

		<HTMLInput
			id="phone"
			v-model:value="appointment.phone"
			:label="$t('calendar.form.phone')"
			:validators="{
				maxLength: 20,
			}"
		/>
		<HTMLSwitch
			id="tattoo"
			v-model:checked="appointment.hasIdea"
			:label="$t('calendar.form.idea')"
		/>
		<template v-if="appointment.hasIdea">
			<HTMLSelect
				id="area"
				v-model:value="appointment.area"
				:label="$t('calendar.form.area')"
				:validators="{
					required: true,
				}"
			>
				<option value="">
					{{ $t('calendar.form.areas.select') }}
				</option>
				<option
					v-for="area in areas"
					:key="area.value"
					:value="area.value"
				>
					{{ area.name }}
				</option>
			</HTMLSelect>
			<div class="Dimensions">
				<HTMLInput
					id="height"
					v-model:value="appointment.height"
					:label="$t('calendar.form.height')"
					type="number"
					:validators="{
						required: true,
					}"
				/>
				<HTMLInput
					id="width"
					v-model:value="appointment.width"
					:label="$t('calendar.form.width')"
					type="number"
					:validators="{
						required: true,
					}"
				/>
			</div>
			<HTMLSelect
				id="color"
				v-model:value="appointment.color"
				:label="$t('calendar.form.color')"
				:validators="{
					required: true,
				}"
			>
				<option value="">
					{{ $t('calendar.form.colors.select') }}
				</option>
				<option value="black">
					{{ $t('calendar.form.colors.black') }}
				</option>
				<option value="fullColor">
					{{ $t('calendar.form.colors.fullColor') }}
				</option>
			</HTMLSelect>
		</template>
		<HTMLTextArea
			id="description"
			v-model:value="appointment.description"
			:label="$t('calendar.form.description')"
			:validators="{ required: true, maxLength: 500 }"
		/>
		<HTMLInputImages
			id="images"
			v-model:images="appointment.images"
			:label="$t('calendar.form.images')"
			:max-files="4"
			:validators="{ required: false }"
		/>

		<HTMLButton :with-background="true" type="submit">{{
			$t('calendar.form.button')
		}}</HTMLButton>
	</MinimalForm>
</template>

<style scoped lang="scss">
.Dimensions {
	display: flex;
	gap: 15px;
}
</style>
