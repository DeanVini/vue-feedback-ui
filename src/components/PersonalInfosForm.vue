<template>
  <form @submit.prevent="submitForm">
    <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 20rem">
      <div class="text-center mt-4 mb-4 text-xl font-semibold">Insira seus dados</div>

      <div class="field">
        <label for="customerName">Nome</label>
        <InputText
          id="customerName"
          v-model="formData.customerName"
          :class="{ 'p-invalid': errors.customerName }"
          @blur="validateField('customerName')"
          class="w-full"
        />
        <Message v-if="errors.customerName" severity="error" variant="simple" class="p-error">{{
          errors.customerName
        }}</Message>
      </div>

      <div class="field">
        <label for="customerEmail">Email</label>
        <InputText
          id="customerEmail"
          v-model="formData.customerEmail"
          :class="{ 'p-invalid': errors.customerEmail }"
          type="email"
          @blur="validateField('customerEmail')"
          class="w-full"
        />
        <Message v-if="errors.customerEmail" severity="error" variant="simple" class="p-error">{{
          errors.customerEmail
        }}</Message>
      </div>
    </div>

    <div class="flex pt-6 justify-end">
      <Button
        v-tooltip="!isFormValid ? 'É necessário preencher todos os campos antes de continuar.' : ''"
        label="Próximo"
        icon="pi pi-arrow-right"
        iconPos="right"
        type="submit"
        :disabled="!isFormValid"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { Button, InputText, Message } from 'primevue'
import * as yup from 'yup'
import { reactive, computed } from 'vue'

type FormField = 'customerName' | 'customerEmail'

const props = defineProps({
  activateCallback: {
    type: Function,
    required: true,
  },
})

const formData = reactive({
  customerName: '',
  customerEmail: '',
})

const errors = reactive({
  customerName: '',
  customerEmail: '',
})

const emit = defineEmits(['personal-infos'])

const schema = yup.object().shape({
  customerName: yup.string().required('Nome é obrigatório'),
  customerEmail: yup.string().email('Email deve ser válido').required('Email é obrigatório'),
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
  return (
    !errors.customerName && !errors.customerEmail && formData.customerName && formData.customerEmail
  )
})

const submitForm = async () => {
  const isValid = await validateForm()
  if (isValid) {
    emit('personal-infos', formData)
    props.activateCallback(2)
  }
}
</script>
