import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_HOST

export async function axiosInstance(
  method: string,
  path: string = '',
  data: object = {},
  params: object = {},
  headers: object = {},
) {
  try {
    return (
      await axios({
        method: method,
        url: `${BASE_URL}/${path}`,
        data: data,
        params: params,
        headers: headers,
      })
    ).data
  } catch (error: any) {
    throw error.response ?? error
  }
}
