import { createSlice } from "@reduxjs/toolkit";

export interface IsUIState {
    isNewUser:boolean;
}

const initialState : IsUIState = {
    isNewUser:false
}


export const IsUISlice = createSlice({
    name:"UI",
    initialState,
    reducers:{
        setIsNewUser:(state,action) => {
            state.isNewUser = action.payload
        }
    }
})

export const {setIsNewUser} = IsUISlice.actions
export default IsUISlice.reducer