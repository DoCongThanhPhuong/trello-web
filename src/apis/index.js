import axiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

// Boards
export const getBoardsByUserIdAPI = async () => {
  const response = await axiosInstance.get(`${API_ROOT}/v1/boards`)
  return response.data
}

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
export const loginAPI = async (userData) => {
  const response = await axiosInstance.post(
    `${API_ROOT}/v1/users/login`,
    userData
  )
  return response.data
}

export const getBoardMembersAPI = async (boardId) => {
  const response = await axiosInstance.get(
    `${API_ROOT}/v1/users/members/${boardId}`
  )
  return response.data
}

export const getProfileAPI = async () => {
  const response = await axiosInstance.get(`${API_ROOT}/v1/users/profile`)
  return response.data
}
