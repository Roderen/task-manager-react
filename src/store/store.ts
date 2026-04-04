import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import {authApi} from "@/api/authApi.ts";
import {tasksApi} from "@/api/tasksApi.ts";

export const store = configureStore({
   reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [tasksApi.reducerPath]: tasksApi.reducer,
   },
   middleware: (getDefaultMiddleware) =>
       getDefaultMiddleware().concat(
           authApi.middleware,
           tasksApi.middleware
       ),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch