import React, { PropsWithChildren, useEffect } from 'react'
import MainNavigator from './MainNavigator'
import { useSelector } from 'react-redux'
import { AuthSelector } from '../redux/uiSlice'
import { useGetUserQuery } from '../api/userService'

export const Navigator:React.FC = () => {
    const {token,isAuthenticated,isRegisterd,user,isNewUser} = useSelector(AuthSelector)
    const {data:userData,isLoading,refetch} = useGetUserQuery()

    console.log(isNewUser,"----user----",isRegisterd)
    // handle is registered logic if user left the registration form after loggin in
    useEffect(()=>{
        if(token){
            console.clear()
            console.log("hi from-----")
            refetch().then(res=>console.log(res,"---res-----")).catch(err=>console.log(err,"error"))
        }
        console.log(userData,"--userdata--")
    },[token])
  return  <MainNavigator isLoggedIn={isAuthenticated} isNewUser={isNewUser}/>
   
  
}
