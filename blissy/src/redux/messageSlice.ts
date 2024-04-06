// messageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from '.';

interface Message {
  id: string;
  text: string;
  sender: string;
}

interface MessageState {
  messages: Message[];
  chatScreenActive:boolean;
  messageCount:number;
}

const initialState: MessageState = {
  messages: [],
  chatScreenActive:false,
  messageCount:0
};

const MessageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      state.messageCount = state.messageCount+1
    },
    resetMessages: (state) => {
        state.messages = [];
        state.messageCount = 0
      }, 
      setChatScreenActive:(state,action:PayloadAction<boolean>)=>{
        state.chatScreenActive = action.payload
      },
      resetMessageCount:(state)=>{
        state.messageCount = 0
      }
  },
});

export const { addMessage,resetMessages,setChatScreenActive,resetMessageCount } = MessageSlice.actions;
export const MessageSelector = (state:IRootState)=>state.Message.messages
export const chatScreenActiveSelector = (state:IRootState)=>state.Message.chatScreenActive
export const MessageCountSelector = (state:IRootState)=>state.Message.messageCount

export default MessageSlice;
