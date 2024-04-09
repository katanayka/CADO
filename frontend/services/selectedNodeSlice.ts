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
  name: 'selectedNode',
  initialState,
  reducers: {
    setSelectedNode: (state, action: PayloadAction<SelectedNodeState>) => {
      return action.payload;
    },
  },
});

export const { setSelectedNode } = selectedNodeSlice.actions;

export default selectedNodeSlice.reducer;