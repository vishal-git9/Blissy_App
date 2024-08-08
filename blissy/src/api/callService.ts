import {API} from './Api';




export const CallApi = API.injectEndpoints({
  endpoints: builder => ({
    postCallInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: `/call-record/create-random-call`,
        method: 'POST',
        body
      }),
    }),
    updateCallInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: `/create-random-call/update`,
        method: 'PUT',
        body
      }),
    }),
    getmyCallInfo: builder.query<any, any>({
      query: () => ({
        url: `/call-record/getMyCalls`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    deleteSingleCallInfo:builder.mutation<any,any>({
      query:(id)=>({
        url:`/call-record/delete`,
        method: 'DELETE',
        body:{id},
        // responseHandler:"text"
      })
    })
  })
});

export const {useUpdateCallInfoMutation,useGetmyCallInfoQuery,useLazyGetmyCallInfoQuery,usePostCallInfoMutation,useDeleteSingleCallInfoMutation} = CallApi;
