import React, { PropsWithChildren, useEffect } from 'react'
import MainNavigator from './MainNavigator'
import { useSelector } from 'react-redux'
import { AuthSelector } from '../redux/uiSlice'
import { useGetUserQuery } from '../api/userService'

export const Navigator:React.FC = () => {
    const {token,isAuthenticated,isRegisterd,user} = useSelector(AuthSelector)
    const {data:userData,isLoading,refetch} = useGetUserQuery()

    console.log(user?.isNewUser,"----user----",isRegisterd)
    useEffect(()=>{
        if(token){
            refetch().then(res=>console.log(res))
        }
        console.log(userData,"--userdata--")
    },[token])
  return  <MainNavigator isLoggedIn={isAuthenticated} isNewUser={user?.isNewUser!}/>
   
  
}
