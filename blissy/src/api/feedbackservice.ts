import {API} from './Api';




export const FeebackApi = API.injectEndpoints({
  endpoints: builder => ({
    postAppreview: builder.mutation<any, any>({
      query: (body) => ({
        url: `/app-reviews/`,
        method: 'POST',
        body
      }),
    }),
    getAppreview: builder.query<any, any>({
      query: () => ({
        url: `/app-reviews/getmyreview`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    postBugReports: builder.mutation<any, any>({
      query: (body) => ({
        url: `/bug-reports/`,
        method: 'POST',
        body
      }),
    }),
    getmyBugReports: builder.query<any, any>({
      query: () => ({
        url: `/bug-reports/findmybug`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    getmyTodayquotes: builder.query<any, any>({
      query: () => ({
        url: `/random-quotes/get-quote`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    addmyquotes: builder.mutation<any, any>({
      query: (body) => ({
        url: `/random-quotes/add-quote`,
        method: 'POST',
        body
      }),
    }),
  })
});

export const {useGetAppreviewQuery,usePostAppreviewMutation,usePostBugReportsMutation,useGetmyBugReportsQuery,useGetmyTodayquotesQuery,useAddmyquotesMutation} = FeebackApi;
