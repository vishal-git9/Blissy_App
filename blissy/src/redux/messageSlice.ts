// messageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from '.';
import { UserInterface } from './uiSlice';
import { ChatApi } from '../api/chatService';

interface Message {
  id: string;
  text: string;
  sender: string;
}

interface ChatList {
  userId:string;
  chatPartner:UserInterface
}
export interface ActiveUserList{
  _id : String,
  id:String,
  name:String,
  socketId:String,
  userId:UserInterface
}

interface MessageState {
  messages: Message[];
  chatScreenActive:boolean;
  messageCount:number;
  activeUserList:ActiveUserList[];
  chatList:ChatList[];
  newMessages:Message[]
}

const initialState: MessageState = {
  messages: [],
  chatScreenActive:false,
  messageCount:0,
  activeUserList:[],
  chatList:[],
  newMessages:[]
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
      },
      getActiveUserList:(state, action:PayloadAction<ActiveUserList[]>)=>{
        state.activeUserList = action.payload
      }
  },
  extraReducers:(builder)=>{
    builder.addMatcher(ChatApi.endpoints.getNewMessage.matchFulfilled,(state,{payload})=>{
      state.newMessages = payload
      
    })
    builder.addMatcher(ChatApi.endpoints.getChatlist.matchFulfilled,(state,{payload})=>{
      state.chatList = payload
    })
    builder.addMatcher(ChatApi.endpoints.sendMessage.matchFulfilled,(state,{payload})=>{
      
    })
}
});

export const { addMessage,resetMessages,setChatScreenActive,resetMessageCount, getActiveUserList } = MessageSlice.actions;
export const MessageSelector = (state:IRootState)=>state.Message.messages
export const chatListSelector = (state:IRootState)=>state.Message.chatList
export const newMessagesSelector = (state:IRootState)=>state.Message.newMessages
export const chatScreenActiveSelector = (state:IRootState)=>state.Message.chatScreenActive
export const MessageCountSelector = (state:IRootState)=>state.Message.messageCount
export const ActiveUserListSelector = (state:IRootState)=> state.Message

export default MessageSlice;
