<template>
  <div class="content-interview">
    <app-card>
      <template #title>Нова співбесіда</template>
      <template #content>
        <app-input-text class="input mb-3" placeholder="Компанія" v-model="company" />
        <app-input-text
          v-model="vacancyLink"
          class="input mb-3"
          placeholder="Опис вакансії (посилання)"
        />
        <app-input-text v-model="hrName" class="input mb-3" placeholder="Контакт (ім'я)" />
        <app-input-text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
        <app-input-text v-model="email" class="input mb-3" placeholder="Email" />
        <app-input-text v-model="contactPhone" class="input mb-3" placeholder="Телефон HR" />
        <app-button
          @click="addNewInterview"
          label="Створити співбесіду"
          :disabled="disabledSaveButton"
          :loading="loading"
        ></app-button>
      </template>
    </app-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IInterview } from '@/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { getAuth } from 'firebase/auth'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

const db = getFirestore()
const router = useRouter()

const company = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const email = ref<string>('')
const contactPhone = ref<string>('')
const loading = ref<boolean>(false)

const addNewInterview = async (): Promise<void> => {
  loading.value = true
  const payload: IInterview = {
    id: uuidv4(),
    company: company.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    email: email.value,
    contactPhone: contactPhone.value,
    createdAt: new Date()
  }
  const userId = getAuth().currentUser?.uid
  if (userId) {
    await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload).then(() => {
      router.push('/list')
    })
  }
}

const disabledSaveButton = computed(() => {
  return !(company.value && vacancyLink.value && hrName.value)
})
</script>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}

.input {
  width: 100%;
}
</style>
