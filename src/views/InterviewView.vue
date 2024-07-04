<template>
  <div class="content-interview">
    <app-card>
      <template #title>Співбесіда в компанію</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Компанія</label>
          <app-input-text class="input mb-3" id="company"></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Опис вакансії</label>
          <app-input-text class="input mb-3" id="vacancyLink"></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="hrName">Ім'я HR</label>
          <app-input-text class="input mb-3" id="hrName"></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="email">Пошта</label>
          <app-input-text class="input mb-3" id="email"></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram HR</label>
          <app-input-text class="input mb-3" id="contactTelegram"></app-input-text>
        </div>

        <div class="flex flex-column gap-2">
          <label for="contactPhone">Телефон HR</label>
          <app-input-text class="input mb-3" id="contactPhone"></app-input-text>
        </div>

        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number inputId="salaryFrom" placeholder="Заплатня від" />
          </div>
          <div class="flex-auto">
            <app-input-number inputId="salaryTo" placeholder="Зарплатня до" />
          </div>
        </div>
        <app-button label="Додати етап" severity="info" icon="pi pi-plus" class="mb-3" />

        <div class="interview-stage">
          <div class=".flex flex-column gap-2">
            <label for="stageCalendar">Дата проходження етапу</label>
            <app-calendar
              class="input mb-3"
              id="stageCalendar"
              dateFormat="dd.mm.yyyy"
            ></app-calendar>
          </div>

          <div class="flex flex-column gap-2">
            <label for="stageDescription">Коментар</label>
            <app-textarea class="input mb-3" rows="5" />
          </div>
          <app-button label="Видалити етап" severity="danger" />
        </div>

        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <app-radio inputId="interviewResult1" name="result" value="Refusal" />
            <label for="interviewResult1" class="ml-2">Відмова</label>
          </div>

          <div class="flex align-items-center">
            <app-radio inputId="interviewResult2" name="result" value="Offer" />
            <label for="interviewResult2" class="ml-2">Офер</label>
          </div>
          <app-button label="Зберігти" icon="pi pi-save" />
        </div>
      </template>
    </app-card>
  </div>
</template>

<script setup lang="ts"></script>

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
