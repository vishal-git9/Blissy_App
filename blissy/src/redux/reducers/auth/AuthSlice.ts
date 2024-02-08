import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../";
import axios from "axios";
import { ApiEndPoint } from "../../../config";

interface OtpSendData {
  // Define the structure of your sendOtp data here
}

interface OtpVerifyData {
  // Define the structure of your verifyOtp data here
}

interface ErrorResponse {
    msg: string;
    // Include any other properties you expect in your error response
  }

export const OtpSend = createAsyncThunk(
  "Otp/Send",
  async (_insertData: any, thunkAPI) => {
    try {
      const response = await axios.post(`${ApiEndPoint}/otp/send`, _insertData, {
        headers: {
          // Authorization: localStorage.getItem("jwtToken"),
        },
      });
      return response.data as OtpSendData;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            return thunkAPI.rejectWithValue(e.response.data as ErrorResponse);
          } else {
            // If it's not an Axios error or doesn't have a response property, handle accordingly
            return thunkAPI.rejectWithValue({ msg: 'An error occurred' } as ErrorResponse);
          }    
        }
  }
);

export const OtpVerify = createAsyncThunk(
  "Otp/verify",
  async (_insertData: any, thunkAPI) => {
    try {
      const response = await axios.post(`${ApiEndPoint}/otp/verify`, _insertData, {
        headers: {
          // Authorization: localStorage.getItem("jwtToken"),
        },
      });
      return response.data as OtpVerifyData;
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            return thunkAPI.rejectWithValue(e.response.data as ErrorResponse);
          } else {
            // If it's not an Axios error or doesn't have a response property, handle accordingly
            return thunkAPI.rejectWithValue({ msg: 'An error occurred' } as ErrorResponse);
          }    
        }
  }
);

interface AuthState {
  isFetchingSendOtp: boolean;
  isSendOtpSuccess: boolean;
  isSendOtpError: boolean;
  sendOtpErrorMessage: string;
  sendOtpData: OtpSendData[];
  isVerifyingOtp: boolean;
  isVerifiedOtpSuccess: boolean;
  isVerifiedOtpError: boolean;
  isVerifyingOtpMessage: string;
  isVerifiedOtpData: OtpVerifyData[];
}

export const AuthSlice = createSlice({
  name: "Auth",
  initialState: <AuthState>{
    isFetchingSendOtp: false,
    isSendOtpSuccess: false,
    isSendOtpError: false,
    sendOtpErrorMessage: "",
    sendOtpData: [],
    // verify OTP initial state
    isVerifyingOtp: false,
    isVerifiedOtpSuccess: false,
    isVerifiedOtpError: false,
    isVerifyingOtpMessage: "",
    isVerifiedOtpData: [],
  },
  reducers: {
    clearOtpSend: (state) => {
      state.isSendOtpSuccess = false;
      state.isSendOtpError = false;
      state.sendOtpErrorMessage = "";
      state.sendOtpData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(OtpSend.pending, (state) => {
        state.isFetchingSendOtp = true;
      })
      .addCase(OtpSend.fulfilled, (state, action) => {
        state.isFetchingSendOtp = false;
        state.isSendOtpSuccess = true;
        state.sendOtpData = action.payload;
      })
      .addCase(OtpSend.rejected, (state, action) => {
        state.isFetchingSendOtp = false;
        state.isSendOtpSuccess = false;
        state.isSendOtpError = true;
        state.sendOtpErrorMessage = action.payload?.msg || "An error occurred";
      })
      .addCase(OtpVerify.pending, (state) => {
        state.isVerifyingOtp = true;
        state.isSendOtpSuccess = false;
      })
      .addCase(OtpVerify.fulfilled, (state, action) => {
        if (action.payload.status !== 403) {
          state.isVerifyingOtp = false;
          state.isVerifiedOtpSuccess = true;
          state.isVerifiedOtpData = action.payload;
        } else {
          state.isVerifiedOtpError = true;
          state.isVerifyingOtp = false;
        }
      })
      .addCase(OtpVerify.rejected, (state, action) => {
        state.isVerifiedOtpError = true;
        state.isVerifyingOtp = false;
        state.isVerifiedOtpSuccess = false;
        state.isVerifyingOtpMessage = action.payload?.msg || "An error occurred";
      });
  },
});

export const { clearOtpSend } = AuthSlice.actions;

export const authSelector = (state: RootState) => state.auth;
