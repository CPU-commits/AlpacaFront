<script lang="ts" setup>
import * as echarts from 'echarts'

const props = defineProps<{
	data: Array<{ name: string; value: number }>
	map: 'santiago'
	title: string
	item: string
}>()

// Charts
const chart = ref<null | HTMLElement>(null)

function setChart() {
	const myChart = echarts.init(chart.value, null, {
		renderer: 'canvas',
		height: 400,
	})

	myChart.setOption({
		title: {
			text: props.title,
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
			formatter: `{b}: {c} ${props.item}`,
		},
		visualMap: {
			min: 0,
			max: props.data.reduce((a, b) => (a > b.value ? a : b.value), 0),
			left: 'left',
			top: 'bottom',
			text: ['Más', 'Menos'],
			inRange: {
				color: ['white', '#f9322c'],
			},
			calculable: true,
		},
		series: [
			{
				name: props.item,
				type: 'map',
				map: props.map,
				roam: true,
				data: props.data,
			},
		],
	})
}

onMounted(() =>
	fetch(
		`${useRuntimeConfig().public.API}/assets/geojson/${props.map}.geojson`,
	)
		.then((res) => res.json())
		.then((geoJson) => {
			echarts.registerMap(props.map, geoJson)
			setChart()
		}),
)

watch(props, setChart)
</script>

<template>
	<div ref="chart" />
</template>
