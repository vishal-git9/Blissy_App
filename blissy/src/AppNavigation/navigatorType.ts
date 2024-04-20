import { Socket } from "socket.io-client";
import { ProfileData } from "../mockdata/healerData";
import { UserInterface } from "../redux/uiSlice";
import { Dispatch, SetStateAction } from "react";

export type RootStackParamList = {
    Onboarding:undefined;
    Home: undefined;
    Login:undefined;
    Registration:{params:UserInterface | null};
    Healerdetails:{ item: ProfileData };
    Healerlist:undefined;
    Drawer:undefined;
    Connection:undefined;
    ChatWindow:{ userDetails: UserInterface | null,socketId:string | null};
    Chatlist:undefined;
    Calllist:undefined;
    Wallet:undefined;
    Coupons:undefined;
    ReviewScreen:{name:String | undefined};
    AudioCallScreen:{user:UserInterface|null};
    ComingsoonScreen:{screenName:string}
  };
  