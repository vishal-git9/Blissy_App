import { UserState } from '../container/Registration/Registration';
import { UserInterface } from '../redux/uiSlice';
import {API} from './Api';




export const ChatApi = API.injectEndpoints({
  endpoints: builder => ({
    getChatlist: builder.query<any, any>({
      query: (userId) => ({
        url: `chat/get-chat-list/:${userId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    sendMessage: builder.mutation<any, Partial<UserState>>({
      query: (body) => ({
        url: 'chat/post-message',
        method: 'POST',
        body
      }),
    }),
    getNewMessage: builder.query<any, any>({
        query: (query) => ({
          url: `chat/get-chat-list/${query.userId}/${query.recieverId}`,
          method: 'GET',
        }),
        keepUnusedDataFor: 0,
      }),
  }),
});

export const {useGetChatlistQuery,useSendMessageMutation,useGetNewMessageQuery} = ChatApi;
