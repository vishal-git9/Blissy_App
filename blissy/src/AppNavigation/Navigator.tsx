import React, { PropsWithChildren, useEffect } from 'react'
import MainNavigator from './MainNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { AuthSelector, logoutUser } from '../redux/uiSlice'
import { useGetUserQuery } from '../api/userService'
import { NavigationStackProps } from '../container/Prelogin/onboarding'

export const Navigator:React.FC<NavigationStackProps> = ({navigation}) => {
    const {token,isAuthenticated,isRegisterd,user,isNewUser} = useSelector(AuthSelector)
    const {data:userData,isLoading,refetch} = useGetUserQuery()
    const dispatch = useDispatch()
    console.log(isNewUser,"----user----",isRegisterd)
    // handle is registered logic if user left the registration form after loggin in
    useEffect(()=>{
        if(token){
            console.log("hi from-----")
            refetch().then(res=>{
                res.isError && console.log("navigatinologin==")
                res.isError && dispatch(logoutUser())
            }).catch(err=>console.log(err))
        }
        console.log(userData,"--userdata--", user)
    },[token])
  return  <MainNavigator isLoggedIn={isAuthenticated} isNewUser={isNewUser}/>
   
  
}
