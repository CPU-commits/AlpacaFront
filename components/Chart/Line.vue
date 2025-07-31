<script lang="ts" setup>
import * as echarts from 'echarts'

const props = defineProps<{
	title: string
	data: Array<{
		name: string
		data: Array<number>
		color?: string
	}>
	xAxisData: Array<string>
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
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: props.data.map(({ name }) => name),
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: props.xAxisData,
		},
		yAxis: {
			type: 'value',
			minInterval: 1,
		},
		series: props.data.map(({ data, name, color }) => ({
			name: name,
			type: 'line',
			data,
			itemStyle: {
				color,
			},
		})),
	})
}

onMounted(setChart)

watch(props, setChart)
</script>

<template>
	<div ref="chart" />
</template>
