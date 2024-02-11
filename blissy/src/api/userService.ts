import {API} from "./Api"


export const UserApi = API.injectEndpoints({
    endpoints:(builder)=>({
        getUser:builder.query<any,void>({
            query:()=>({
                url:'user/get-user',
                method:"GET"
            })
        })
    })
})

export const {useGetUserQuery} = UserApi