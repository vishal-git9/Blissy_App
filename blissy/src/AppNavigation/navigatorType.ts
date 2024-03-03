import { ProfileData } from "../mockdata/healerData";

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
    ReviewScreen:{}
  };
  