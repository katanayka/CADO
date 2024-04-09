// store.ts
import { configureStore } from '@reduxjs/toolkit';
import selectedNodeReducer from '@/services/selectedNodeSlice';

export const store = configureStore({
  reducer: {
    selectedNode: selectedNodeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;