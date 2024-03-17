import { Socket } from "socket.io-client";
import { ProfileData } from "../mockdata/healerData";
import { UserInterface } from "../redux/uiSlice";

export type RootStackParamList = {
    Onboarding:undefined;
    Home: undefined;
    Login:undefined;
    Registration:{};
    Healerdetails:{ item: ProfileData };
    Healerlist:undefined;
    Drawer:undefined;
    Connection:undefined;
    ChatWindow:{ userId: string };
    Chatlist:undefined;
    Calllist:undefined;
    Wallet:undefined;
    Coupons:undefined;
    ReviewScreen:{name:String | undefined};
    AudioCallScreen:{socket:Socket,user:UserInterface|null};
  };
  