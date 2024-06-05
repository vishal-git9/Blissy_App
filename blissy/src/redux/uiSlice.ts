import { createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "../api/authService";
import { IRootState } from ".";
import { UserApi } from "../api/userService";
import { Socket } from "socket.io-client";


export interface UserInterface {
    _id:string;
    mobileNumber: string;
  role: string;
  name: string;
  isNewUser: Boolean;
  username: string;
  age: number;
  gender:string;
  interest: [string];
  language: [string];
  profilePic: string;
  isActive: Boolean;

}
export interface IsUIState {
    token:string;
    user:null | UserInterface;
    isAuthenticated:boolean
    isRegisterd:boolean;
    isNewUser:boolean;
    socket:Socket | null
    fcmToken:string;
}

const initialState : IsUIState = {
    token:'',
    user:null,
    isAuthenticated:false,
    isRegisterd:false,
    isNewUser:true,
    socket:null,
    fcmToken:'',
}


export const AuthSlice = createSlice({
    name:"Auth",
    initialState,
    reducers:{
        setUsertoken:(state,action) => {
            state.token = action.payload
        },
        setUserState:(state,action)=>{
            state.isNewUser = action.payload
        },
        setSocket:(state,action)=>{
            state.socket = action.payload
        },
        setFcmToken:(state,action)=>{
            state.fcmToken = action.payload
        }
        ,
        logoutUser: ()=> initialState
    },
    extraReducers:(builder)=>{
        builder.addMatcher(AuthApi.endpoints.verifyOtp.matchFulfilled,(state,{payload})=>{
            const {token} = payload.data
            state.token = token
            state.isAuthenticated= true
        })
        builder.addMatcher(UserApi.endpoints.getUser.matchFulfilled,(state,{payload})=>{

            console.log(payload,"payload---->")
            state.user = payload?.data?.user
            state.fcmToken = payload?.data?.user?.DeviceFcmtoken?.fcmToken
            // state.isNewUser =payload.data.user.isNewUser
        })
        builder.addMatcher(UserApi.endpoints.postUser.matchFulfilled,(state,{payload})=>{
            state.isRegisterd = true
            state.isNewUser = false
        })
    }
})

export const {setUsertoken,logoutUser,setUserState,setSocket,setFcmToken} = AuthSlice.actions
export const AuthSelector = (state:IRootState)=>state.Auth
export default AuthSlice.reducer