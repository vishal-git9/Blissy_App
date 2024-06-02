import React, { PropsWithChildren, useEffect } from 'react'
import MainNavigator from './MainNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { AuthSelector, logoutUser } from '../redux/uiSlice'
import { UserApi, useGetUserQuery } from '../api/userService'
import { NavigationStackProps } from '../container/Prelogin/onboarding'
import { AuthApi } from '../api/authService'
import { ChatApi } from '../api/chatService'

export const Navigator:React.FC = () => {
    const {token,isAuthenticated,isRegisterd,user,isNewUser} = useSelector(AuthSelector)
    const {data:userData,isLoading,refetch} = useGetUserQuery()
    const dispatch = useDispatch()
    console.log(isNewUser,"----user----",isRegisterd,token)
    // handle is registered logic if user left the registration form after loggin in
    useEffect(()=>{
        if(token){
            console.log("hi from-----")
            refetch().then(res=>{
                if(res.isError){
                    dispatch(logoutUser())
                    dispatch(AuthApi.util.resetApiState())
                    dispatch(UserApi.util.resetApiState())
                    dispatch(ChatApi.util.resetApiState())
                    
                    // navigate to token expire screen or modal
                }
            }).catch(err=>console.log(err))
        }
        console.log(userData,"--userdata--", user)
    },[token])
  return  <MainNavigator isLoggedIn={isAuthenticated} isNewUser={isNewUser}/>
   
  
}
