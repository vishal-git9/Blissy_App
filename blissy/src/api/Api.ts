import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { serverBaseUrl } from "../utils/globalVariable";

export const API = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:serverBaseUrl
    }),

    endpoints:()=>({})
    
})
