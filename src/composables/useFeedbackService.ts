import { axiosInstance } from '@/services/axiosInstance.ts'
import type { FeedbackInput } from '@/interfaces/feedback.ts'

export const  useFeedbackService = () => {
  const getAll = async (page: number = 0, limit: number = 10) => {
    return axiosInstance(
      'get',
      `feedbacks?page=${page}&limit=${limit}`,
    )
  }

  const getOne = async (id: number) => {
    return axiosInstance(
      'get',
      `feedbacks/${id}`,
    )
  }

  const create = async (data: FeedbackInput) => {
    return axiosInstance(
      'post',
      'feedbacks',
      data,
    )
  }

  const update = async (id: number, data: FeedbackInput) => {
    return axiosInstance(
      'patch',
      `feedbacks/${id}`,
      data,
    )
  }

  const remove = async (id: number) => {
    return axiosInstance(
      'delete',
      `feedbacks/${id}`,
    )
  }

  return{
    getAll,
    getOne,
    create,
    update,
    remove
  }
}
