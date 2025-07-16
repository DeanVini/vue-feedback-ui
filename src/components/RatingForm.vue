<template>
  <form @submit.prevent="submitForm">
    <div class="flex flex-col gap-4 mx-auto" style="min-height: 16rem; max-width: 30rem">
      <div class="text-center mt-4 mb-4 text-xl font-semibold">Avalie sua experiência</div>

      <div class="field">
        <div class="flex flex-col w-full items-center">
          <label for="rating" class="block mb-2"></label>
          <Rating
            class="scale-150"
            id="rating"
            v-model="formData.rating"
            :cancel="false"
            :stars="5"
            @change="validateField('rating')"
          />
          <Message v-if="errors.rating" severity="error" variant="simple" class="p-error mt-1">{{
            errors.rating
          }}</Message>
        </div>
      </div>

      <div class="field">
        <Textarea
          id="message"
          v-model="formData.message"
          :class="{ 'p-invalid': errors.message }"
          @blur="validateField('message')"
          rows="5"
          class="w-full"
          placeholder="Conte-nos sobre sua experiência..."
          autoResize
        />
        <Message v-if="errors.message" severity="error" variant="simple" class="p-error mt-1">{{
          errors.message
        }}</Message>
      </div>
    </div>

    <div class="flex pt-6 justify-between">
      <Button
        label="Voltar"
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="activateCallback(1)"
      />
      <Button
        v-tooltip="!isFormValid ? 'É necessário preencher todos os campos antes de continuar.' : ''"
        label="Publicar"
        icon="pi pi-check"
        iconPos="right"
        type="submit"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { Button, Textarea, Rating, Message } from 'primevue'
import * as yup from 'yup'
import { reactive, computed } from 'vue'

const props = defineProps({
  activateCallback: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['submit-feedback'])

type FormField = 'rating' | 'message'

const formData = reactive({
  rating: 0,
  message: '',
})

const errors = reactive({
  rating: '',
  message: '',
})

const schema = yup.object().shape({
  rating: yup
    .number()
    .min(1, 'Por favor, selecione uma avaliação')
    .required('Avaliação é obrigatória'),
  message: yup
    .string()
    .min(5, 'O comentário deve ter pelo menos 5 caracteres')
    .required('Comentário é obrigatório'),
})

const validateField = async (field: FormField) => {
  try {
    await yup.reach(schema, field).validate(formData[field])
    errors[field] = ''
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      errors[field] = error.message
    }
  }
}

const validateForm = async () => {
  try {
    await schema.validate(formData, { abortEarly: false })
    return true
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      error.inner.forEach((e: yup.ValidationError) => {
        if (e.path) {
          errors[e.path as FormField] = e.message
        }
      })
    }
    return false
  }
}

const isFormValid = computed(() => {
  return !errors.rating && !errors.message && formData.rating > 0 && formData.message
})

const submitForm = async () => {
  const isValid = await validateForm()
  if (isValid) {
    emit('submit-feedback', {
      rating: formData.rating,
      message: formData.message,
    })
    props.activateCallback(2)
  }
}
</script>
