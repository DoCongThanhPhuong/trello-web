import { toast } from 'react-toastify'
import axiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

// Boards
export const listUserBoardsAPI = async (query) => {
  const response = await axiosInstance.get(`${API_ROOT}/v1/boards${query}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axiosInstance.patch(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axiosInstance.patch(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
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
  const response = await axiosInstance.patch(
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
  const response = await axiosInstance.patch(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  )
  return response.data
}

// Users
export const registerUserAPI = async (data) => {
  const response = await axiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  )
  toast.success('Account registered successfully!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await axiosInstance.patch(
    `${API_ROOT}/v1/users/verify`,
    data
  )
  toast.success('Account verified successfully!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await axiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}
