import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

export const fetchNotificationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await axiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await axiosInstance.patch(
      `${API_ROOT}/v1/invitations/board/${invitationId}`,
      { status }
    )
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      state.currentNotifications.unshift(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationsAPI.fulfilled, (state, action) => {
      let incomingNotifications = action.payload
      state.currentNotifications = Array.isArray(incomingNotifications)
        ? incomingNotifications.reverse()
        : []
    })

    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      let incomingNotification = action.payload
      const getInvitation = state.currentNotifications.find(
        (i) => i._id === incomingNotification._id
      )
      getInvitation.boardInvitation = incomingNotification.boardInvitation
    })
  }
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

export const notificationsReducer = notificationsSlice.reducer
