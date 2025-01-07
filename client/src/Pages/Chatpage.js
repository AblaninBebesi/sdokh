import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chatstate } from '../Context/ChatProvider'
import Header from '../components/header/Header';
import ChatList from '../components/Chatlist/ChatList';
import ChatBox from '../components/Chatbox/ChatBox';
import './chatpage.css';

const Chatpage = () => {
    const { user } = Chatstate();
    const [fetchAgain, setFetchAgain] = useState(false);
    return (
        <div className="chat-container">
            {user && <Header/>}
           <div className="chat-inner">
                <div className="sidebar">{user && <ChatList fetchAgain={fetchAgain}/>}</div>
                <div className="main-box">{user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}</div>
           </div>
        </div>
    )
}

export default Chatpage;