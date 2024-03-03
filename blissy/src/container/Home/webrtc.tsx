import React, {useEffect, useState, useRef} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import SocketIOClient, {Socket} from 'socket.io-client';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import TalkNowButton from '../../common/button/Talknow';
import IncomingCallScreen from './incoming';
import {OutgoingCallScreen} from './outgoing';
import {Connection} from '../Connection/connection';
import CallingScreen from '../Connection/callingscreen';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppNavigation/navigatorType';

interface AppProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  socket: Socket;
}

const VoiceCall: React.FC<AppProps> = ({navigation, socket}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [type, setType] = useState<string>('JOIN');
  const [callerId] = useState<string>(
    Math.floor(100000 + Math.random() * 900000).toString(),
  );
  const otherUserId = useRef<string | null>(null);

  const [localMicOn, setLocalMicOn] = useState<boolean>(true);
  const [localWebcamOn, setLocalWebcamOn] = useState<boolean>(true);

  const peerConnection = useRef<RTCPeerConnection>(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  let remoteRTCMessage = useRef<RTCSessionDescription | null>(null);

  useEffect(() => {
    socket.on(
      'newCall',
      (data: {rtcMessage: RTCSessionDescription; callerId: string}) => {
        remoteRTCMessage.current = data.rtcMessage;
        otherUserId.current = data.callerId;
        setType('INCOMING_CALL');
        console.log("getting the call")
      },
    );

    socket.on('callAnswered', (data: {rtcMessage: RTCSessionDescription}) => {
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      setType('WEBRTC_ROOM');
    });

    socket.on(
      'ICEcandidate',
      (data: {rtcMessage: {candidate: string; id: string; label: number}}) => {
        let message = data.rtcMessage;

        peerConnection.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(() => console.log('SUCCESS'))
          .catch(err => console.log('Error', err));
      },
    );

    // let isFront = false;

    // mediaDevices.enumerateDevices().then(sourceInfos => {
    //   let videoSourceId;
    //   for (let i = 0; i < sourceInfos.length; i++) {
    //     const sourceInfo = sourceInfos[i];
    //     if (sourceInfo.kind == 'videoinput' && sourceInfo.facing == (isFront ? 'user' : 'environment')) {
    //       videoSourceId = sourceInfo.deviceId;
    //     }
    //   }

    mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(stream => {
        setLocalStream(stream);
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });
      })
      .catch(error => {
        console.log(error);
      });
    // });

    peerConnection.current.addEventListener('track', event => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    });
    peerConnection.current.addEventListener(
      'icecandidate',
      (event: {candidate: RTCIceCandidate | null}) => {
        console.log(event.candidate,"event candidate")
        if (event.candidate) {
          sendICEcandidate({
            calleeId: otherUserId.current!, // Assuming otherUserId is always set when this callback is called
            rtcMessage: {
              label: event.candidate.sdpMLineIndex!, // Non-null assertion used, ensure these are indeed non-null
              id: event.candidate.sdpMid!, // Non-null assertion used, ensure these are indeed non-null
              candidate: event.candidate.candidate!, // Non-null assertion used, ensure these are indeed non-null
            },
          });
        } else {
          console.log('can not ice candidate');
        }
      },
    );

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

  useEffect(() => {
    InCallManager.start({media: 'audio'});
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      InCallManager.stop();
    };
  }, []);

  function sendICEcandidate(data: {
    calleeId: string;
    label: number;
    rtcMessage: RTCIceCandidate;
  }) {
    socket.emit('ICEcandidate', data);
  }

  async function processCall() {
    const sessionDescription = await peerConnection.current.createOffer({});
    await peerConnection.current.setLocalDescription(sessionDescription);
    sendCall({
      calleeId: otherUserId.current!,
      rtcMessage: sessionDescription,
    });
  }

  async function processAccept() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current!),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current!,
      rtcMessage: sessionDescription,
    });
  }

  function answerCall(data: {
    callerId: string;
    rtcMessage: RTCSessionDescription;
  }) {
    socket.emit('answerCall', data);
  }

  function sendCall(data: {
    calleeId: string;
    rtcMessage: RTCSessionDescription;
  }) {
    socket.emit('call', data);
  }

  function toggleMic() {
    localMicOn ? setLocalMicOn(false) : setLocalMicOn(true);
    localStream?.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave() {
    peerConnection.current.close();
    setLocalStream(null);
    setType('JOIN');
  }

  switch (type) {
    case 'JOIN':
      return (
        <>
          <TextInput
            placeholder={'Enter Caller ID'}
            style={{width:"100%",borderWidth:1,borderColor:"white",color:"white"}}
            value={otherUserId.current!}
            onChangeText={text => {
              otherUserId.current = text;
              console.log('TEST', otherUserId.current);
            }}
            multiline={true}
            numberOfLines={1}    
            placeholderTextColor={"white"}
            keyboardType={'number-pad'}
          />
          <TalkNowButton
            label="Connect Now"
            onPress={() => {
              setType('OUTGOING_CALL');
              processCall();
            }}
          />
        </>
      );
    case 'INCOMING_CALL':
      return (
        <IncomingCallScreen
          otherUserId={otherUserId.current ?? 'Unknown'}
          processAccept={processAccept}
          setType={setType}
        />
      );
    case 'OUTGOING_CALL':
      return (
        <OutgoingCallScreen
          otherUserId={otherUserId.current ?? 'Unknown'}
          setType={setType}
        />
      );
    case 'WEBRTC_ROOM':
      return (
        <CallingScreen
          leave={leave}
          toggleMic={toggleMic}
          navigation={navigation}
        />
      );
    default:
      return null;
  }
};

export default VoiceCall;
