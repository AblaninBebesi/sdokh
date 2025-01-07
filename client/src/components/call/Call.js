import  { React, useEffect, useState } from 'react'
import { Chatstate } from '../../Context/ChatProvider'
import { getSender } from '../../config/ChatLogics'
import Ringing from './Ringing'
import Header from './Header'
import CallArea from './CallArea'
import CallActions from './CallActions'
import './call.css'

export default function Call({call, setCall,showCallWindow, callAccepted, myVideo, userVideo, stream, answerCall, endCall}) {
    
  const { user, selectedChat} = Chatstate();
  const {receiveingCall, callEnded} = call;

    useEffect(() => {

    }, [call]);

    useEffect(() => {

    }, [showCallWindow]);

  return (
    <div>
      {<div className={`call-main glass-effect
        ${(!showCallWindow && !receiveingCall) || callEnded ? "d-none" : ""}
        `}>
        
        <Header endCall= {endCall}/>
        <CallArea />
        <CallActions endCall={ endCall }/>
        
        <div className='video-streams'>
        { callAccepted && !callEnded ?  
          <div className='user-video'>
            <video ref={userVideo} playsInline muted autoPlay></video>
          </div>: null}
          
          <div className='my-video'>
            <video ref={myVideo} playsInline muted autoPlay></video>
          </div>
        </div>
      </div>}
      {receiveingCall && !callAccepted && 
      <Ringing call= {call}  setCall = {setCall} answerCall = {answerCall} endCall= {endCall}/>}
    </div>
  )
}
