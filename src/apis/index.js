import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Tạo một instance mới của axios
const axiosInstance = axios.create()

// Thêm Interceptor để xử lý trước khi gửi mỗi yêu cầu
axiosInstance.interceptors.request.use((config) => {
  // Lấy accessToken từ localStorage
  const accessToken = localStorage.getItem('accessToken')

  // Nếu có accessToken, thêm vào header Authorization của yêu cầu
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

/** Không try catch hay then catch để bắt lỗi trong các function vì sẽ dẫn đến dư thừa code
 * Giải pháp: sử dụng Interceptors của axios để bắt lỗi tập trung
 */

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

// Users
export const createNewUserAPI = async (newUserData) => {
  const response = await axiosInstance.post(`${API_ROOT}/v1/users`, newUserData)
  return response.data
}

export const getUsersByBoardIdAPI = async (boardId) => {
  const response = await axiosInstance.get(`${API_ROOT}/v1/users/${boardId}`)
  return response.data
}
