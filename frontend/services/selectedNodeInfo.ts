// selectedNodeInfo.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SelectedNodeInfoState = {
  id: string;
  parentId: string;
  text: string;
  inside: string;
};

const initialState: SelectedNodeInfoState = {
  id: '',
  parentId: '',
  text: '',
  inside: '',
};

export const selectedNodeInfoSlice = createSlice({
  name: 'selectedNodeInfo',
  initialState,
  reducers: {
    setSelectNodeInfo: (state, action: PayloadAction<SelectedNodeInfoState>) => {
      return action.payload;
    },
  },
});

export const { setSelectNodeInfo } = selectedNodeInfoSlice.actions;

export default selectedNodeInfoSlice.reducer;