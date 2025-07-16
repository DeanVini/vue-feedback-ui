<template>
  <Dialog :closable="false" v-model:visible="visible" modal :style="{ width: '25rem' }">
    <template #header>
      <div class="w-full flex justify-end">
        <Button
          icon="pi pi-times"
          severity="contrast"
          variant="text"
          rounded
          aria-label="Filter"
          @click="visible = false"
        />
      </div>
    </template>
    <Stepper v-model:value="activeStep" class="basis-[40rem]">
      <StepList>
        <Step v-slot="{ value, a11yAttrs }" asChild disabled :value="1">
          <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
            <Divider />
            <button
              class="bg-transparent border-0 inline-flex flex-col gap-2"
              v-bind="a11yAttrs.header"
            >
              <span
                :class="[
                  'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                  {
                    '!bg-primary text-primary-contrast border-primary': Number(value) <= activeStep,
                    'border-surface-200 dark:border-surface-700': Number(value) > activeStep,
                  },
                ]"
              >
                <i class="pi pi-user" />
              </span>
            </button>
            <Divider />
          </div>
        </Step>
        <Step v-slot="{ value, a11yAttrs }" disabled asChild :value="2">
          <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
            <button
              class="bg-transparent border-0 inline-flex flex-col gap-2"
              v-bind="a11yAttrs.header"
            >
              <span
                :class="[
                  'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                  {
                    'bg-primary text-primary-contrast border-primary': Number(value) <= activeStep,
                    'border-surface-200 dark:border-surface-700': Number(value) > activeStep,
                  },
                ]"
              >
                <i class="pi pi-star" />
              </span>
            </button>
            <Divider />
          </div>
        </Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" :value="1">
          <PersonalInfosForm
            :activate-callback="activateCallback"
            @personal-infos="
              (infos) => {
                editForm(infos)
              }
            "
          />
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" :value="2">
          <RatingForm
            :activate-callback="activateCallback"
            @submit-feedback="
              (ratingForm) => {
                editForm(ratingForm)
                publishFeedback()
              }
            "
          />
          <div class="flex pt-6 justify-between"></div>
        </StepPanel>
      </StepPanels>
    </Stepper>
    <Button label="Show" @click="show()" />
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Dialog, Stepper, StepPanel, StepPanels, Step, StepList, Divider } from 'primevue'
import { ref } from 'vue'
import PersonalInfosForm from '@/components/PersonalInfosForm.vue'
import RatingForm from '@/components/RatingForm.vue'
import { useFeedbackService } from '@/composables/useFeedbackService.ts'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits(['success'])

const toast = useToast()

const visible = defineModel('visible', {
  type: Boolean,
  default: false,
  required: true,
})

const activeStep = ref(1)

const show = () => {
  toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 })
}

const feedbackCreationForm = ref({
  customerName: '',
  customerEmail: '',
  rating: 0,
  message: '',
})

const editForm = (newForm: object) => {
  feedbackCreationForm.value = Object.assign(feedbackCreationForm.value, newForm)
}

const publishFeedback = () => {
  useFeedbackService()
    .create(feedbackCreationForm.value)
    .then(() => {
      visible.value = false
      activeStep.value = 1
      feedbackCreationForm.value = {
        customerName: '',
        customerEmail: '',
        rating: 0,
        message: '',
      }
      toast.add({
        severity: 'success',
        summary: 'Avaliação publicada',
        detail: 'A sua avaliação foi publicada com sucesso. Muito obrigado!',
        life: 3000,
      })
      emit('success')
    })
    .catch((error) => {
      console.error('Error publishing feedback:', error)
      toast.add({
        severity: 'error',
        summary: 'Não foi possível publicar a avaliação',
        detail: 'Houve um erro ao publicar a sua avaliação. Por favor, tente novamente mais tarde.',
        life: 3000,
      })
    })
}
</script>
