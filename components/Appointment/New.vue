<script lang="ts" setup>
import type { StudioPerson } from '~/models/studio/person.model'

const { idStudio, idTattooArtist } = defineProps<{
	idStudio?: number
	avatar?: string
	username: string
	tattooArtists?: Array<StudioPerson>
	idTattooArtist?: number
}>()
// i18n
const { t } = useI18n()
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
	idTattooArtist,
})
const showThanks = ref(false)
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

function redirect() {
	showThanks.value = true
	setTimeout(() => {
		useRouter().push(`/${useAuthStore().getUsername}/calendar`)
	}, 5000)
}

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
		{ idTattooArtist: appointment.idTattooArtist, idStudio },
	)
	if (success) {
		useToastsStore().addToast({
			message: t('calendar.form.success'),
			type: 'success',
		})
		redirect()
	}
}
</script>

<template>
	<MinimalForm v-if="!showThanks" :action="requestAppointment">
		<template #title>
			<ProfileAvatar :avatar="avatar" />
			<h3>
				{{
					idStudio
						? $t('calendar.addWithStudio', {
								nickname: username,
							})
						: $t('calendar.addWith', {
								nickname: username,
							})
				}}
			</h3>
		</template>
		<SelectAvatar
			v-if="idStudio"
			id="tattooArtist"
			:label="$t('calendar.form.selectTattooArtist')"
			:users="
				tattooArtists?.map((user) => ({
					name: user.user.name,
					email: user.user.email,
					id: user.idUser,
					retrieveAvatar: user.idUser,
				})) ?? []
			"
			:validators="{
				required: true,
			}"
			@update:user="
				(user) => {
					if (!user) appointment.idTattooArtist = undefined
					else appointment.idTattooArtist = user.id
				}
			"
		/>

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
	<MinimalForm v-else :action="() => {}">
		<template #title>
			<ProfileAvatar :avatar="avatar" />
			<h3>{{ $t('calendar.thanks', { nickname: username }) }}</h3>
		</template>

		<Illustration illustration="thanks" :margin-top="false" />

		<HTMLTimer />
	</MinimalForm>
</template>

<style scoped lang="scss">
.Dimensions {
	display: flex;
	gap: 15px;
}
</style>
