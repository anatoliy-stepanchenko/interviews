<template>
  <div class="content-interview">
    <app-card>
      <template #title>Нова співбесіда</template>
      <template #content>
        <fieldset class="border p-2 mb-3">
          <legend class="text-sm text-grey-100">Обов'язкові поля</legend>
          <app-input-text class="input mb-3" placeholder="Компанія" v-model="company" />
          <app-input-text
            v-model="vacancyLink"
            class="input mb-3"
            placeholder="Опис вакансії (посилання)"
          />
          <app-input-text v-model="hrName" class="input mb-3" placeholder="Ім'я HR" />
          <app-input-text v-model="email" class="input mb-3" placeholder="Email" />
        </fieldset>
        <app-input-text
          v-model="contactTelegram"
          class="input mb-3"
          placeholder="Telegram username HR"
        />
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
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const db = getFirestore()
const router = useRouter()
const userStore = useUserStore()

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

  if (userStore.userId) {
    await setDoc(doc(db, `users/${userStore.userId}/interviews`, payload.id), payload).then(() => {
      router.push('/list')
    })
  }
}

const disabledSaveButton = computed(() => {
  return !(company.value && vacancyLink.value && hrName.value && email.value)
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

fieldset {
  border: 1px solid #2fc5e36e;
  border-radius: 8px;
}

legend {
  color: lightblue;
  padding: 0 10px;
  margin: 0 auto;
}
</style>
