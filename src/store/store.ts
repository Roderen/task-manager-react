import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";
import {authApi} from "@/api/authApi.ts";
import {tasksApi} from "@/api/tasksApi.ts";
import {usersApi} from "@/api/usersApi.ts";
import {useDispatch} from "react-redux";
import {messagesApi} from "@/api/messagesApi.ts";

export const store = configureStore({
   reducer: {
      auth: authReducer,
      chat: chatReducer,
      [authApi.reducerPath]: authApi.reducer,
      [tasksApi.reducerPath]: tasksApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [messagesApi.reducerPath]: messagesApi.reducer,
   },
   middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(
           authApi.middleware,
           tasksApi.middleware,
           usersApi.middleware,
           messagesApi.middleware
       ),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()