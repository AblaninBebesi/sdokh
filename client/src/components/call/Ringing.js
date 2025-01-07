import  { React, useEffect, useState } from 'react'
import { CloseIcon, ValidIcon } from "../../svg"
import { Chatstate } from '../../Context/ChatProvider'
import { getSender } from '../../config/ChatLogics'

export default function Ringing({call, setCall, endCall, answerCall}) {

    const { user, selectedChat } = Chatstate();
    const [timer, setTimer] = useState(0);
    const {receiveingCall, callEnded, name} = call;
  
    useEffect(() => {
      let interval = null; // Define inside useEffect for proper scoping
      if (timer <= 10) {
        interval = setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);
      } else {
        setCall(prevCall => ({
          ...prevCall,
          receiveingCall: false
        }));
      }
      console.log(call)
      return () => clearInterval(interval); // Cleanup interval properly
    }, [timer, setCall]);

    useEffect(() => {

    }, [call]);
  
    return (
      <div className="ringing-container glass-effect">
        {/*Container*/}
        <div className="call-info">
          {/*Call infos*/}
          <div className="some-shit">
            <div>
              <h1 className="dark:text-white">
                <b>{name}</b>
              </h1>
              <span className="dark:text-dark_text_2">Videocall...</span>
            </div>
          </div>
          {/*Call actions*/}
          <ul className="ringing-menu">
            <li onClick={endCall}>
              <button className="ringing-btn ignore-btt">
                <CloseIcon className="fill-white w-5" />
              </button>
            </li>
            <li onClick={answerCall}>
              <button className="ringing-btn answer-btt">
                <ValidIcon className="fill-white w-6 mt-2" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }