// store.ts
import { configureStore } from '@reduxjs/toolkit';
import selectedNodeReducer from '@/services/selectedNodeSlice';
import selectedNodeToHideReducer from '@/services/selectedNodeToHide';
import selectedNodeInfoReducer from '@/services/selectedNodeInfo';

export const store = configureStore({
  reducer: {
    selectedNode: selectedNodeReducer,
    selectedNodeToHide: selectedNodeToHideReducer,
    selectedNodeInfo: selectedNodeInfoReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;