import {API} from "./Api"


interface sendOtpInterface {
    mobileNumber:string;
}

interface verifyOtpInterface {

}

const AuthApi = API.injectEndpoints({
    endpoints:(builder)=>({
        getOtp:builder.mutation<sendOtpInterface,Partial<sendOtpInterface>>({
            query:(body)=>({
                url:"auth/otp/generate",
                body
            })
        }),
        verifyOtp:builder.mutation<verifyOtpInterface,Partial<verifyOtpInterface>>({
            query:(body)=>({
                url:"auth/otp/verify",
                body
            })
        }),
    })
})

export const {useGetOtpMutation} = AuthApi