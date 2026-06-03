import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const onlineSlice = createSlice({
  name: 'online',
  initialState: {
    onlineUsers: [] as number[],
  },
  reducers: {
    setUserOnline(state, action: PayloadAction<number>) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload)
      }
    },
    setUserOffline(state, action: PayloadAction<number>) {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload)
    },
  },
})

export const { setUserOnline, setUserOffline } = onlineSlice.actions
export default onlineSlice.reducer
