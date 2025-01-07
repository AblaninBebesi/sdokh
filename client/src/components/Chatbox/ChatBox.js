import { React, useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Chatstate } from '../../Context/ChatProvider'
import { getSender, getSenderId } from '../../config/ChatLogics'
import socket from '../../config/socket'
import ScrollableChat from './ScrollableChat'
import Peer from "simple-peer";
import Call from '../call/Call'
import './chatbox.css'

const ENDPOINT = "https://sdokh.onrender.com";
var selectedCharCompare;
const callData = {
  socketId: '',
    receiveingCall: false,
    callEnded: false,
    name: '',
  };

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat } = Chatstate();
    const [msgs, setMsgs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMsg, setNewMsg] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const [call, setCall] = useState(callData);
    const [showCallWindow, setShowCallWindow] = useState(false);
    const [stream, setStream] = useState();
    const {receiveingCall, callEnded, socketId} = call;
    const [callAccepted, setCallAccepted] = useState(false);

    const myVideo = useRef(null);
    const userVideo = useRef(null);
    const connectionRef = useRef();

    const fetchMsgs = async() => {
        if (!selectedChat) return;
        socket.emit("join chat", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMsgs(data);
            setLoading(false);
            
        } catch (err) {
            console.log(err);
        }
    }

    const sendMsg = ( async(e) => {
        e.preventDefault();
        socket.emit("stop typing", selectedChat._id);
        if(newMsg === "") return;
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.post('/api/message', {
                content: newMsg,
                chatId: selectedChat._id,
            }, config);
            setNewMsg("");
            socket.emit("new message", data);
            setMsgs((prevMsgs) => [...prevMsgs, data]);
            //console.log(data);
            document.getElementById("crutch").value="";
        } catch (err) {
            console.log(err);
        }
    })

    useEffect(() => {
       fetchMsgs();
    }, [selectedChat]);
    
    useEffect(() => {
        socket.emit("setup", user);
    
        socket.on("connected", () => {
            setSocketConnected(true);
            console.log("socket connected");
        });
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
                // Логика для уведомлений о новых сообщениях в других чатах
            } else {
                setMsgs((prevMsgs) => [...prevMsgs, newMessageRecieved]);
            }
        });
        return () => {
            socket.off("connected");
            socket.off("typing");
            socket.off("stop typing");
            socket.off("message recieved");
        };
    }, [selectedChat]);
    

    const typingHandler = (e) => {
        setNewMsg(e.target.value);
    
        if (!socketConnected) return;
    
        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 5000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        }, timerLength);
      };

    
  //--call user funcion
  const callUser = (() =>{
    enableMedia();
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on('signal', (data) => {
      socket.emit('call user', {
        userToCall: getSenderId(user, selectedChat.users),
        name: getSender(user, selectedChat.users),
        signal: data,
        from: socketId,
      });
    });
    peer.on('stream', (stream)  => {
      const interval = setInterval(() => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
          clearInterval(interval); // Stop checking once assigned
        }
      }, 100);
    })
    socket.on('call accepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    })
    connectionRef.current = peer;
  });

  const answerCall = () =>{
    enableMedia();
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });
    peer.on('signal', (data) =>{
      socket.emit('answer call',{ signal: data, to: call.socketId});
    });
    peer.on('stream', (stream)  => {
      const interval = setInterval(() => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
          clearInterval(interval); // Stop checking once assigned
        }
      }, 100);
      connectionRef.current = peer;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    setShowCallWindow(false);
    setCall({ ...call, callEnded: true, receiveingCall: false });
    let interval = setInterval(() => {
      if (myVideo.current) {
        myVideo.current.srcObject = null;
        clearInterval(interval); // Stop checking once assigned
      }
    }, 100);
    interval = setInterval(() => {
      if (userVideo.current) {
        userVideo.current.srcObject = null;
        clearInterval(interval); // Stop checking once assigned
      }
    }, 100);
    socket.emit("end call", call.socketId);
    try {
      connectionRef.current = null;
    }
    catch (error) {
      console.error('Error while ending call:', error);
    }
    setCallAccepted(false);
  };

   useEffect(() => {
    setupMedia();
    socket.on('setup socket', (id) =>{
      setCall(prevCall => ({...prevCall, socketId: id}))
      console.log(socketId);
    });
    socket.on('call user', (data) => {
      setCall(prevCall => ({
        ...prevCall,
        socketId: data.from,
        signal: data.signal,
        name: data.name,
        receiveingCall: true
      }));
    })
    socket.on("end call", () => {
      setShowCallWindow(false);
      setCall({ ...call, callEnded: true, receiveingCall: false });
      let interval = setInterval(() => {
        if (myVideo.current) {
          myVideo.current.srcObject = null;
          clearInterval(interval); // Stop checking once assigned
        }
      }, 100);
      interval = setInterval(() => {
        if (userVideo.current) {
          userVideo.current.srcObject = null;
          clearInterval(interval); // Stop checking once assigned
        }
      }, 100);
      if (callAccepted) {
        try {
          connectionRef.current = null;
        }
        catch (error) {
          console.error('Error while ending call:', error);
        }
      }
      setCallAccepted(false);
    });
  }, [])

  const setupMedia = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        //enableMedia();

      })
      .catch((err) => console.error('Error accessing media devices:', err));
  };

  const enableMedia = (() =>{
    setShowCallWindow(true);
            // Wait until the video element is mounted before assigning stream
        const interval = setInterval(() => {
          if (myVideo.current) {
            myVideo.current.srcObject = stream;
            clearInterval(interval); // Stop checking once assigned
          }
        }, 100);
  });

    //   useEffect(() => {
    //   }, [])

    return (
        <>
            {!selectedChat?(<div>Please select a chat</div>):(
            <>
            <Call call = {call}  
            setCall = {setCall}  
            showCallWindow={showCallWindow}
            callAccepted = {callAccepted}
            myVideo = {myVideo}
            userVideo = {userVideo}
            stream={stream}
            answerCall={answerCall}
            endCall={endCall}
            />
                <div className='chatbox-header'>
                    <h3 className='pal-name'>{getSender(user, selectedChat.users)}</h3>
                    <button className='answer-btt call-btt' onClick={callUser}>Call</button>
                </div>
                <div className="messages-container">
                    {loading ? (<p>loading</p>) : 
                    <div className="messages">
                        <ScrollableChat messages={msgs} isTyping={isTyping}/>
                    </div>}
                    
                    <form className="send">
                        <input onChange={typingHandler} id="crutch" type="text" name="msg">
                        </input>
                        <button type="submit" className="call-window-design" onClick={sendMsg}>{">>"}</button>
                    </form>
                </div>
            </>)}
        </>
    )
}

export default ChatBox;
