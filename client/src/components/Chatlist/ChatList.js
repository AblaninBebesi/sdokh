import { React, useState, useEffect } from 'react';
import { Chatstate } from '../../Context/ChatProvider';
import axios from 'axios';
import { getSender } from '../../config/ChatLogics';
import './chatlist.css';

const ChatList = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = Chatstate();

    const fetchChats = async () => {
        try {
          const config = {
            headers: {
              authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.get("/api/chat", config);
          setChats(data);
        } catch (error) {
         console.log("failed to reach the chats");
        }
      };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain])

    return (
        <div className="chat-list">
            {!chats ? (
                <div></div>
            ) : (
                <>{chats.map((chat) => (
                    <div key={chat._id} onClick={() => setSelectedChat(chat)} className="chat-select">
                        <p className="chat-select-user">{getSender(loggedUser, chat.users)}</p>
                { chat.latestMessage && <span className='latest-msg'>{chat.latestMessage.sender.name}: {chat.latestMessage.content.slice(0, 50 - chat.latestMessage.sender.name.length)}</span>}
                    </div>
                ))}</>
            )}
        </div>
    )
}

export default ChatList;
