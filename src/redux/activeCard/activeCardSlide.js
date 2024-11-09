import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowCardModal: false
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showCardModal: (state) => {
      state.isShowCardModal = true
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.isShowCardModal = false
      state.currentActiveCard = null
    },

    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    }
  },
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {}
})

export const {
  showCardModal,
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard
} = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

export const selectIsShowCardModal = (state) => {
  return state.activeCard.isShowCardModal
}

export const activeCardReducer = activeCardSlice.reducer
