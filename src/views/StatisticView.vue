<template>
  <h1>Статистика</h1>
  <div class="card flex justify-center">
    <app-chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-[30rem] chart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import type { ChartData, ChartOptions } from 'chart.js'

const userStore = useUserStore()
const db = getFirestore()

const chartData = ref<ChartData<'doughnut'>>()
const chartOptions = ref<ChartOptions<'doughnut'>>()
const interviews = ref<IInterview[]>([])

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc')
  )

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

onMounted(async () => {
  interviews.value = await getAllInterviews()
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const setChartData = (): ChartData<'doughnut'> => {
  const documentStyle = getComputedStyle(document.body)

  const data: number[] = [0, 0, 0]

  interviews.value.forEach((interview: IInterview) => {
    if (interview.result === 'Offer') {
      data[0]++
    } else if (interview.result === 'Refusal') {
      data[1]++
    } else {
      data[2]++
    }
  })

  return {
    labels: ['Оффер', 'Відмова', 'В процесі'],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500')
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400')
        ]
      }
    ]
  }
}

const setChartOptions = (): ChartOptions<'doughnut'> => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    cutout: '60%' // це має бути на рівні налаштувань чарта, а не легенди
  }
}
</script>

<style scoped>
.chart {
  width: 600px;
  height: 600px;
  display: flex;
  justify-content: center;
}
</style>
