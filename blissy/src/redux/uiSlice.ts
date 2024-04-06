import { createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "../api/authService";
import { IRootState } from ".";
import { UserApi } from "../api/userService";


export interface UserInterface {
    _id:String;
    mobileNumber: String;
  role: string;
  name: String;
  isNewUser: Boolean;
  username: String;
  age: Number;
  interest: [String];
  language: [String];
  profilePic: String;
  isActive: Boolean;
}
export interface IsUIState {
    token:string;
    user:null | UserInterface;
    isAuthenticated:boolean
    isRegisterd:boolean;
    isNewUser:boolean;
}

const initialState : IsUIState = {
    token:'',
    user:null,
    isAuthenticated:false,
    isRegisterd:false,
    isNewUser:true
}


export const AuthSlice = createSlice({
    name:"Auth",
    initialState,
    reducers:{
        setUsertoken:(state,action) => {
            state.token = action.payload
        },
        logoutUser: ()=> initialState
    },
    extraReducers:(builder)=>{
        builder.addMatcher(AuthApi.endpoints.verifyOtp.matchFulfilled,(state,{payload})=>{
            const {token} = payload.data
            state.token = token
            state.isAuthenticated= true
        })
        builder.addMatcher(UserApi.endpoints.getUser.matchFulfilled,(state,{payload})=>{
            state.user = payload.data.user
        })
        builder.addMatcher(UserApi.endpoints.postUser.matchFulfilled,(state,{payload})=>{
            state.isRegisterd = true
            state.isNewUser = false
        })
    }
})

export const {setUsertoken,logoutUser} = AuthSlice.actions
export const AuthSelector = (state:IRootState)=>state.Auth
export default AuthSlice.reducer