<template>
  <app-dialog />
  <app-progress-spinner v-if="isLoading" />
  <app-message v-else-if="!isLoading && !interviews.length" severity="info"
    >Співбесіди відсутні!</app-message
  >
  <div v-else>
    <h1>Список співбесід</h1>
    <app-datatable :value="interviews">
      <app-column field="company" header="Компанія"></app-column>
      <app-column field="hrName" header="Ім'я HR"></app-column>
      <app-column field="vacancyLink" header="Вакансія">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Посилання</a>
        </template>
      </app-column>
      <app-column field="email" header="Пошта"></app-column>
      <app-column header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column>
      <app-column header="Пройдені етапи">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages">Не заповнено</span>
          <div v-else class="interview-stages">
            <app-badge
              v-for="(stage, i) in slotProps.data.stages"
              v-tooltip.top="stage.name"
              :key="i"
              :value="i + 1"
              rounded
            />
          </div>
        </template>
      </app-column>
      <app-column header="Зарплатня">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom">Не заповнено</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>
      <app-column header="Результат">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">Не заповнено</span>
          <template v-else>
            <app-badge
              :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
              :value="slotProps.data.result === 'Offer' ? 'Оффер' : 'Відмова'"
            />
          </template>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info" />
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRemoveInterview(slotProps.data.id)"
            />
          </div>
        </template>
      </app-column>
    </app-datatable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'

const userStore = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc')
  )
  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы бажаєте видалити співбесіду?',
    header: 'Видалення співбесіди',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Відхилити',
    acceptLabel: 'Видалити',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))

      const listIntervies: Array<IInterview> = await getAllInterviews()
      interviews.value = [...listIntervies]

      isLoading.value = false
    }
  })
}

onMounted(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews()

  interviews.value = [...listInterviews]

  isLoading.value = false
})
</script>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__phone {
  color: #25d366;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
