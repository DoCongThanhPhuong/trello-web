/* eslint-disable indent */
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '~/utils/constants'

// Tạo một instance mới của axios
const axiosInstance = axios.create()

// Thêm Interceptor để xử lý trước khi gửi mỗi yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem('accessToken')

    // Nếu có accessToken, thêm vào header Authorization của yêu cầu
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Thêm Interceptor để xử lý lỗi phản hồi từ server
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server đã trả về phản hồi nhưng có lỗi
      const { status, data } = error.response

      switch (status) {
        case 401:
          toast.error(data.message || 'Unauthorized! Please log in again.')
          break
        case 403:
          toast.error(
            data.message ||
              'Forbidden! You do not have permission, wait a minute to continue.'
          )
          break
        case 404:
          toast.error(data.message || 'Resource not found!')
          break
        case 500:
          toast.error(data.message || 'Internal server error!')
          break
        default:
          toast.error(data.message || 'An error occurred!')
      }
    } else if (error.request) {
      // Yêu cầu đã được gửi nhưng không có phản hồi
      toast.error('No response from server!')
    } else {
      // Có lỗi xảy ra trong quá trình thiết lập yêu cầu
      toast.error('Error in setting up request!')
    }

    return Promise.reject(error)
  }
)

// Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  return response.data
}

export const getBoardsByUserIdAPI = async () => {
  const response = await axiosInstance.get(
    `${API_ROOT}/v1/boards/user/list_boards`
  )
  return response.data
}

export const createNewBoardAPI = async (newBoardsData) => {
  const response = await axiosInstance.post(
    `${API_ROOT}/v1/boards`,
    newBoardsData
  )
  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  )
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  )
  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await axiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  )
  return response.data
}

// Users
export const createNewUserAPI = async (newUserData) => {
  const response = await axiosInstance.post(`${API_ROOT}/v1/users`, newUserData)
  return response.data
}

export const getUsersByBoardIdAPI = async (boardId) => {
  const response = await axiosInstance.get(`${API_ROOT}/v1/users/${boardId}`)
  return response.data
}
