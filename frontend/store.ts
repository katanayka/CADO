// store.ts
import { configureStore } from '@reduxjs/toolkit';
import selectedNodeReducer from '@/services/selectedNodeSlice';
import selectedNodeToHideReducer from '@/services/selectedNodeToHide';

export const store = configureStore({
  reducer: {
    selectedNode: selectedNodeReducer,
    selectedNodeToHide: selectedNodeToHideReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;