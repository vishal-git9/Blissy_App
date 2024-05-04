import { UserState } from '../container/Registration/Registration';
import { Message } from '../redux/messageSlice';
import { UserInterface } from '../redux/uiSlice';
import {API} from './Api';




export const ChatApi = API.injectEndpoints({
  endpoints: builder => ({
    getChatlist: builder.query<any, any>({
      query: (userId) => ({
        url: `chat/get-chat-list/${userId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    getChatwindowList:builder.query<any,any>({
      query: (query) => ({
        url: `chat/get-chat/${query.userId}/${query.receiverId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    addNewUserToList:builder.mutation<any, Partial<Message>>({
      query: (body) => ({
        url: 'chat/add-chatlist',
        method: 'PUT',
        body
      }),
    }),
    sendMessage: builder.mutation<any, Partial<Message>>({
      query: (body) => ({
        url: 'chat/post-message',
        method: 'PUT',
        body
      }),
    }),
    markReadMessage: builder.mutation<any, any>({
      query: (body) => ({
        url: 'chat/markRead',
        method: 'PUT',
        body
      }),
    }),

    getNewMessage: builder.query<any, any>({
        query: (query) => ({
          url: `chat/get-new-chat/${query.userId}`,
          method: 'GET',
        }),
        keepUnusedDataFor: 0,
      }),
  })
});

export const {useGetChatlistQuery,useSendMessageMutation,useGetNewMessageQuery,useAddNewUserToListMutation,useGetChatwindowListQuery,useMarkReadMessageMutation} = ChatApi;
