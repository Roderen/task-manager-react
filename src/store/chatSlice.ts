import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    activeConversationId: null as number | null,
  },
  reducers: {
    openChat: (state) => {
      state.isOpen = true
    },
    closeChat: (state) => {
      state.isOpen = false
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload
    },
    clearActiveConversation: (state) => {
      state.activeConversationId = null
    },
  }
})

export const {
  openChat, closeChat,
  toggleChat,
  setActiveConversation,
  clearActiveConversation
} = chatSlice.actions
export default chatSlice.reducer
