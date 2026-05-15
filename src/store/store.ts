import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import {authApi} from "@/api/authApi.ts";
import {tasksApi} from "@/api/tasksApi.ts";
import {usersApi} from "@/api/usersApi.ts";
import {useDispatch} from "react-redux";

export const store = configureStore({
   reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [tasksApi.reducerPath]: tasksApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
   },
   middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(
           authApi.middleware,
           tasksApi.middleware,
           usersApi.middleware
       ),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()