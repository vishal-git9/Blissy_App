import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IRootState } from ".";

export interface Coupon{
    _id: string;
    coinName:string;
    coins:number;
    earnedAt:string;
    userId:string;
}

export interface TotalCoins{
    userId:string;
    coins:number
}

interface rewardState{
    coupons:Coupon[];
    totalCoins:number;
}

const initialState:rewardState = {
    coupons:[],
    totalCoins:0
}

const RewardSlice = createSlice({
    name:'rewards',
    initialState,
    reducers:{
        getAllCoupons: (state, action: PayloadAction<Coupon[]>) => {
            state.coupons = action.payload;
        },
        getTotalCoins:(state, action:PayloadAction<number>)=>{
            state.totalCoins = action.payload;
        }
    }
})

export const {getAllCoupons,getTotalCoins} = RewardSlice.actions;

export const CouponsSelector = (state: IRootState)=> state.Rewards.coupons
export const TotalCoinsSelector = (state: IRootState)=> state.Rewards.totalCoins

export default RewardSlice;