import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IConversationMinimized {
  name: string;
  _id: string;
  avatar: string;
}

export interface ConversationPopupState {
  conversationIds: string[];
  conversationMinimized: IConversationMinimized[];
}

const initialState: ConversationPopupState = {
  conversationIds: [],
  conversationMinimized: [],
};

export const conversationPopupSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    addConversationId: (state, action: PayloadAction<string>) => {
      if (state.conversationIds.includes(action.payload)) return;
      if (state.conversationIds.length >= 3) state.conversationIds.shift();
      state.conversationIds.push(action.payload);
      state.conversationMinimized = state.conversationMinimized.filter(
        (conversation) => conversation._id !== action.payload
      );
    },
    removeConversationId: (state, action: PayloadAction<string>) => {
      state.conversationIds = state.conversationIds.filter((id) => id !== action.payload);
    },
    addConversationMinimized: (state, action: PayloadAction<IConversationMinimized>) => {
      state.conversationMinimized.push(action.payload);
    },
    removeConversationMinimized: (state, action: PayloadAction<string>) => {
      state.conversationMinimized = state.conversationMinimized.filter(
        (conversation) => conversation._id !== action.payload
      );
    },
  },
});

export const { addConversationId, removeConversationId, addConversationMinimized, removeConversationMinimized } =
  conversationPopupSlice.actions;

export default conversationPopupSlice.reducer;
