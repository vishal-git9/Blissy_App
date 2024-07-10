import { Socket } from "socket.io-client";
import { ProfileData } from "../mockdata/healerData";
import { UserInterface } from "../redux/uiSlice";
import { Dispatch, SetStateAction } from "react";
import { ChatList, Message } from "../redux/messageSlice";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Login: undefined;
  Registration: { UserData: UserInterface | null };
  Healerdetails: { item: ProfileData };
  Healerlist: undefined;
  Drawer: undefined;
  Connection: undefined;
  ChatWindow: { userDetails: UserInterface | null, socketId: string | undefined, Chats: ChatList | null,senderUserId:string | null };
  Chatlist: undefined;
  Calllist: undefined;
  Wallet: undefined;
  CouponsScreen: undefined;
  ReviewScreen: { user: UserInterface | null, socketId: string | null };
  AudioCallScreen: { user: UserInterface | null };
  ComingsoonScreen: { screenName: string }
  ChatPartnerDetails:{chatPartner:UserInterface | null}
  IncomingCall:{}
  Bugreport:{}
  Userreview:{}
  Outgoing:{ConnectedUserData:UserInterface | undefined,socketId:string | undefined}
};
