<template>
  <Dialog :closable="false" v-model:visible="visible" modal :style="{ width: '30rem' }">
    <template #header>
      <div class="w-full flex justify-between items-center">
        <h2 class="text-xl font-semibold">Detalhes do Feedback</h2>
        <Button
          icon="pi pi-times"
          severity="contrast"
          variant="text"
          rounded
          aria-label="Fechar"
          @click="closeDialog"
        />
      </div>
    </template>
    <div class="p-4">
      <!-- Informações do cliente -->
      <div class="mb-4">
        <div class="flex items-center gap-2">
          <Avatar icon="pi pi-user" shape="circle" />
          <span class="font-bold">{{ props.feedback?.customerName }}</span>
        </div>
        <span class="text-sm text-gray-500">{{ props.feedback?.customerEmail }}</span>
      </div>

      <!-- Avaliação -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Avaliação:</label>
        <div v-if="!isEditing" class="flex items-center" @click="enableEditing">
          <Rating disabled v-model="currentRating" />
          <span class="ml-2">({{ currentRating }}/5)</span>
        </div>
        <div v-else>
          <Rating v-model="currentRating" :cancel="false" />
          <small v-if="errors.rating" class="p-error block mt-1">{{ errors.rating }}</small>
        </div>
      </div>

      <!-- Mensagem -->
      <div class="mb-5">
        <label class="block text-sm font-medium mb-1">Mensagem:</label>
        <div
          v-if="!isEditing"
          @click="enableEditing"
          class="p-3 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {{ currentMessage }}
          <div class="text-xs text-gray-500 mt-2">Clique para editar</div>
        </div>
        <div v-else>
          <Textarea
            v-model="currentMessage"
            rows="5"
            class="w-full"
            :class="{ 'p-invalid': errors.message }"
            autoResize
          />
          <small v-if="errors.message" class="p-error block mt-1">{{ errors.message }}</small>
        </div>
      </div>

      <!-- Botões de ações -->
      <div class="flex justify-between translate-y-3">
        <div class="flex gap-2">
          <Button v-if="!isEditing" icon="pi pi-pencil" label="Editar" @click="enableEditing" />
          <Button
            v-if="!isEditing"
            icon="pi pi-trash"
            severity="danger"
            label="Excluir"
            @click="confirmDelete"
          />
        </div>
        <div v-if="isEditing" class="flex gap-2">
          <Button icon="pi pi-times" label="Cancelar" severity="secondary" @click="cancelEditing" />
          <Button
            icon="pi pi-check"
            label="Salvar"
            severity="primary"
            :loading="loading"
            @click="saveFeedback"
          />
        </div>
      </div>
    </div>

    <!-- Diálogo de confirmação de exclusão -->
    <ConfirmDialog />
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  Button,
  Textarea,
  Rating,
  Avatar,
  Toast,
  ConfirmDialog,
  useToast,
  useConfirm,
} from 'primevue'
import { ref, reactive, onMounted } from 'vue'
import * as yup from 'yup'
import { useFeedbackService } from '@/composables/useFeedbackService'

const emit = defineEmits(['success', 'update'])
const toast = useToast()
const confirm = useConfirm()
const feedbackService = useFeedbackService()
const loading = ref(false)

const visible = defineModel('visible', {
  type: Boolean,
  default: false,
})

const props = defineProps({
  feedback: {
    type: Object,
    required: true,
  },
})

const isEditing = ref(false)
const currentMessage = ref('')
const currentRating = ref(0)

const errors = reactive({
  message: '',
  rating: '',
})

onMounted(() => {
  // Inicializar valores quando o componente for montado
  resetForm()
})

const resetForm = () => {
  currentMessage.value = props.feedback?.message || ''
  currentRating.value = props.feedback?.rating || 0
  errors.message = ''
  errors.rating = ''
}

const schema = yup.object().shape({
  message: yup
    .string()
    .min(5, 'A mensagem deve ter pelo menos 5 caracteres')
    .required('A mensagem é obrigatória'),
  rating: yup.number().min(1, 'A avaliação é obrigatória').required('A avaliação é obrigatória'),
})

const validate = async () => {
  try {
    await schema.validate(
      { message: currentMessage.value, rating: currentRating.value },
      { abortEarly: false },
    )
    errors.message = ''
    errors.rating = ''
    return true
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      error.inner.forEach((err) => {
        if (err.path === 'message') {
          errors.message = err.message
        }
        if (err.path === 'rating') {
          errors.rating = err.message
        }
      })
    }
    return false
  }
}

const enableEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  resetForm()
  isEditing.value = false
}

// Salvar alterações
const saveFeedback = async () => {
  if (await validate()) {
    loading.value = true
    try {
      const updatedFeedback = {
        ...props.feedback,
        message: currentMessage.value,
        rating: currentRating.value,
      }

      await feedbackService.update(updatedFeedback.id, updatedFeedback)

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Feedback atualizado com sucesso!',
        life: 3000,
      })

      emit('update', updatedFeedback)
      emit('success')
      isEditing.value = false
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível atualizar o feedback',
        life: 3000,
      })
      console.error('Erro ao atualizar feedback:', error)
    } finally {
      loading.value = false
    }
  }
}

const confirmDelete = () => {
  confirm.require({
    message: 'Tem certeza que deseja excluir este feedback?',
    header: 'Confirmação de exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim, excluir',
    rejectLabel: 'Não',
    accept: deleteFeedback,
  })
}

const deleteFeedback = async () => {
  loading.value = true
  try {
    await feedbackService.remove(props.feedback.id)

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Feedback excluído com sucesso!',
      life: 3000,
    })

    emit('success')
    visible.value = false
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível excluir o feedback',
      life: 3000,
    })
    console.error('Erro ao excluir feedback:', error)
  } finally {
    loading.value = false
  }
}

const closeDialog = () => {
  if (isEditing.value) {
    cancelEditing()
  }
  visible.value = false
}
</script>

<style scoped>
.p-dialog-content {
  overflow-x: hidden;
}
</style>
