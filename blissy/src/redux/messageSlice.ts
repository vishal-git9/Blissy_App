// messageSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from '.';
import { UserInterface } from './uiSlice';
import { ChatApi } from '../api/chatService';

export interface Message {
  _id?:string;
  messageId:string;
  message: string;
  senderId: string | undefined;
  receiverId: string | undefined;
  chatId?:string | null;
  isRead: boolean;
  createdAt: string;
  sender?:string;
  isDelivered:boolean;
}

export interface ChatList {
  userId: string;
  chatPartner: UserInterface
  newMessages: Message[];
  allMessages:Message[];
  newMessagesId:string;
  allMessagesId:string;
  socketId?:string;
}
export interface ActiveUserList {
  _id: string,
  id: string,
  name: string,
  socketId: string,
  userId: UserInterface
}

interface MessageState {
  messages: Message[];
  chatScreenActive: boolean;
  messageCount: number;
  activeUserList: ActiveUserList[];
  chatList: ChatList[];
  newMessages: Message[]
}

const initialState: MessageState = {
  messages: [],
  chatScreenActive: false,
  messageCount: 0,
  activeUserList: [],
  chatList: [],
  newMessages: []
};

const MessageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      state.messageCount = state.messageCount + 1
    },
    resetMessages: (state) => {
      state.messages = [];
      state.messageCount = 0
    },
    setChatScreenActive: (state, action: PayloadAction<boolean>) => {
      state.chatScreenActive = action.payload
    },
    resetMessageCount: (state) => {
      state.messageCount = 0
    },
    getActiveUserList: (state, action: PayloadAction<ActiveUserList[]>) => {
      state.activeUserList = action.payload
    },
  pushChatlist:(state,action:PayloadAction<ChatList[]>)=>{
    console.log(action.payload,"chatlistpayload----->")
      state.chatList = action.payload
    },
    // pushNewMessage: (state, action: PayloadAction<{ id: string, payload: Message[] }>) => {
    //   const { id, payload } = action.payload;
    //   console.log(state.chatList,"statechatlist---------->")
    //   const chatListwithId = state.chatList.filter((el)=>el.chatPartner._id === id)
    //   chatListwithId[0].newMessages = payload
    //   state.chatList = {...state.chatList,...chatListwithId}
    // },
    pushCurrentMessage:(state, action: PayloadAction<Message[]>)=>{
      state.newMessages = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(ChatApi.endpoints.getNewMessage.matchFulfilled, (state, { payload }) => {
      state.newMessages = payload

    })
    builder.addMatcher(ChatApi.endpoints.getChatlist.matchFulfilled, (state, { payload }) => {
      console.log(payload,"chatlistpayload------>")
      state.chatList = payload.chatList
    })
    builder.addMatcher(ChatApi.endpoints.sendMessage.matchFulfilled, (state, { payload }) => {

    })
  }
});

export const { addMessage,resetMessages, setChatScreenActive, resetMessageCount, getActiveUserList,pushCurrentMessage,pushChatlist } = MessageSlice.actions;
export const MessageSelector = (state: IRootState) => state.Message.messages
export const chatListSelector = (state: IRootState) => state.Message.chatList
export const newMessagesSelector = (state: IRootState) => state.Message.newMessages
export const chatScreenActiveSelector = (state: IRootState) => state.Message.chatScreenActive
export const MessageCountSelector = (state: IRootState) => state.Message.messageCount
export const ActiveUserListSelector = (state: IRootState) => state.Message

export default MessageSlice;
