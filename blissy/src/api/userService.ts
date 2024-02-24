import { UserState } from '../container/Registration/Registration';
import { UserInterface } from '../redux/uiSlice';
import {API} from './Api';




export const UserApi = API.injectEndpoints({
  endpoints: builder => ({
    getUser: builder.query<any, void>({
      query: () => ({
        url: 'user/get-user',
        method: 'GET',
      }),
    }),
    postUser: builder.mutation<any, Partial<UserState>>({
      query: (body) => ({
        url: 'user/update-user',
        method: 'PUT',
        body
      }),
    }),
  }),
});

export const {useGetUserQuery,usePostUserMutation} = UserApi;
