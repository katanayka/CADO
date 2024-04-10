// selectedNodeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SelectedNodeState = {
  id: string;
  parentId: string;
  text: string;
  inside: string;
};

const initialState: SelectedNodeState = {
  id: '',
  parentId: '',
  text: '',
  inside: '',
};

export const selectedNodeSlice = createSlice({
  name: 'selectedNodeToHide',
  initialState,
  reducers: {
    setSelectedNodeToHide: (state, action: PayloadAction<SelectedNodeState>) => {
      return action.payload;
    },
  },
});

export const { setSelectedNodeToHide } = selectedNodeSlice.actions;

export default selectedNodeSlice.reducer;