<template>
  <div class="p-10 h-full w-full flex justify-center items-center">
    <Card class="h-full max-w-[54rem]">
      <template #header>
        <div
          class="px-5 pt-4 flex flex-col items-center gap-2 md:gap-0 md:flex-row justify-between"
        >
          <h2 class="text-2xl intro-y">Avaliações dos Usuários</h2>
          <div class="text-xl flex text-center items-center pb-2 intro-y">
            <div class="flex">
              <p class="!font-bold !text-3xl self-end">{{ averageRating.toFixed(1) }}</p>
              <p class="!text-md self-end">/5</p>
            </div>
            <div class="flex flex-col">
              <p class="text-sm">({{ totalRecords }} avaliações)</p>
              <Rating
                disabled
                v-model="averageRating"
                class="intro-y px-4 bg-[var(--p-surface-0)] dark:bg-[var(--p-surface-900)]"
              />
            </div>
          </div>
          <Button
            icon="pi pi-plus"
            label="Dar um feedback"
            @click="isFeedbackCreationDialogVisible = true"
          />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-5">
          <div class="card p-4 border border-neutral-600 max-h-[71vh] overflow-y-auto rounded-lg">
            <div v-for="feedback in feedbacks" :key="feedback.id" class="intro-y">
              <Fieldset>
                <template #legend>
                  <div class="flex items-center pl-2">
                    <Avatar icon="pi pi-user" shape="circle" />
                    <span class="font-bold p-2"
                      >{{ feedback.customerName }} - {{ getDistanceDate(feedback.createdAt) }}
                    </span>
                  </div>
                </template>
                <div class="w-full min-w-[45rem] flex justify-between relative">
                  <p class="pl-5 intro-y">
                    {{ feedback.message }}
                  </p>
                  <div class="flex pr-3">
                    <Button
                      icon="pi pi-pencil"
                      severity="contrast"
                      variant="text"
                      rounded
                      aria-label="Search"
                    />
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      variant="text"
                      rounded
                      aria-label="Search"
                    />
                  </div>
                  <div class="absolute p-2 w-full flex justify-end -top-11">
                    <Rating
                      disabled
                      v-model="feedback.rating"
                      class="intro-y px-4 bg-[var(--p-surface-0)] dark:bg-[var(--p-surface-900)]"
                    />
                  </div>
                </div>
              </Fieldset>
            </div>
          </div>
          <Paginator
            :template="{
              '640px': 'PrevPageLink CurrentPageReport NextPageLink',
            }"
            :rows="currentLimit"
            :totalRecords="totalRecords"
            :rowsPerPageOptions="[5, 10, 20, 30]"
            @page="
              ({ page, rows }) => {
                getFeedbacks(page + 1, rows)
              }
            "
          ></Paginator>
        </div>
      </template>
    </Card>
  </div>
  <FeedbackCreationDialog v-model:visible="isFeedbackCreationDialogVisible" />
</template>

<script setup lang="ts">
import { Fieldset, Avatar, Paginator, Card, Button, Rating } from 'primevue'
import { onMounted, ref } from 'vue'
import { useFeedbackService } from '@/composables/useFeedbackService.ts'
import type { Feedback } from '@/interfaces/feedback.ts'
import { formatDistance, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import FeedbackCreationDialog from '@/components/FeedbackCreationDialog.vue'

const feedbackService = useFeedbackService()
const feedbacks = ref<Feedback[]>([])

const currentLimit = ref<number>(10)
const currentPage = ref<number>(1)
const totalRecords = ref<number>(0)
const averageRating = ref<number>(0)
const isFeedbackCreationDialogVisible = ref<boolean>(false)

const getDistanceDate = (date: Date) => {
  return formatDistance(date, new Date(), { addSuffix: true, locale: ptBR })
}

const getFeedbacks = async (page = currentPage.value, limit = currentLimit.value) => {
  try {
    const { data } = await feedbackService.getAll(page, limit)
    totalRecords.value = data.meta.itemCount
    averageRating.value = data.meta.averageRating
    feedbacks.value = data.paginatedData
  } catch (error) {
    console.error('Erro ao buscar os feedbacks', error)
  }
}

onMounted(async () => {
  await getFeedbacks()
})
</script>

<style scoped>
:deep(.p-paginator-page-selected) {
  @apply !outline-1 !outline-[var(--color-lavender-500)] outline-offset-1 transition-all duration-150;
}
</style>
