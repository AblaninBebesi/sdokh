import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate,Routes, Route } from 'react-router-dom';
import Chatpage from '../Pages/Chatpage';
import Home from '../Pages/Home';


const ChatContext = createContext()

const ChatProvider = ({children}) => {

    const [user, setUser] = useState();
    const [selectedChat , setSelectedChat] = useState();
    const [chats, setChats] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if (!userInfo)
            navigate('/');
    }, [navigate]);
    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    )
};

export const Chatstate = () => {
    return useContext(ChatContext);
}


export default ChatProvider;