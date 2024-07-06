<template>
  <app-progress-spinner v-if="isLoading" class="flex justify-content-center mt-8" />
  <div v-else-if="interview?.id && !isLoading" class="content-interview">
    <app-card>
      <template #title>Співбесіда в компанію {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Компанія</label>
          <app-input-text
            v-model="interview.company"
            class="input mb-3"
            id="company"
          ></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Опис вакансії</label>
          <app-input-text
            v-model="interview.vacancyLink"
            class="input mb-3"
            id="vacancyLink"
          ></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="hrName">Ім'я HR</label>
          <app-input-text
            v-model="interview.hrName"
            class="input mb-3"
            id="hrName"
          ></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="email">Пошта</label>
          <app-input-text v-model="interview.email" class="input mb-3" id="email"></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram HR</label>
          <app-input-text
            v-model="interview.contactTelegram"
            class="input mb-3"
            id="contactTelegram"
          ></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="contactPhone">Телефон HR</label>
          <app-input-text
            v-model="interview.contactPhone"
            class="input mb-3"
            id="contactPhone"
          ></app-input-text>
        </div>

        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryFrom"
              inputId="salaryFrom"
              placeholder="Заплатня від"
            />
          </div>
          <div class="flex-auto">
            <app-input-number
              v-model="interview.salaryTo"
              inputId="salaryTo"
              placeholder="Зарплатня до"
            />
          </div>
        </div>
        <app-button
          @click="addStage"
          label="Додати етап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
        />

        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Назва етапу</label>
              <app-input-text
                v-model="stage.name"
                class="input mb-3"
                rows="5"
                :id="`stage-name-${index}`"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Дата проходження етапу</label>
              <app-calendar
                v-model="stage.date"
                class="input mb-3"
                :id="`stage-date-${index}`"
                dateFormat="dd.mm.yy"
                showIcon
                fluid
              ></app-calendar>
            </div>

            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Коментар</label>
              <app-textarea
                v-model="stage.description"
                :id="`stage-description-${index}`"
                class="input mb-3"
                rows="5"
              />
            </div>
            <app-button @click="removeStage(index)" label="Видалити етап" severity="danger" />
          </div>
        </template>

        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <app-radio
              v-model="interview.result"
              inputId="interviewResult1"
              name="result"
              value="Refusal"
            />
            <label for="interviewResult1" class="ml-2">Відмова</label>
          </div>

          <div class="flex align-items-center">
            <app-radio
              v-model="interview.result"
              inputId="interviewResult2"
              name="result"
              value="Offer"
            />
            <label for="interviewResult2" class="ml-2">Офер</label>
          </div>
        </div>
        <app-button @click="saveInterview" label="Зберігти" icon="pi pi-save" />
      </template>
    </app-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import type { IInterview, IStage } from '@/interfaces'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()

const interview = ref<IInterview>()
const isLoading = ref<boolean>(false)

const docref = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate()
          }
        }
        return stage
      })
    }

    interview.value = data
  }

  isLoading.value = false
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docref, { ...interview.value })
  await getData()
  isLoading.value = false
}

onMounted(async () => await getData())
</script>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
