import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender } from '../../config/ChatLogics'
import { Chatstate } from '../../Context/ChatProvider'


const ScrollableChat = ({ messages, isTyping }) => {

    const { user, selectedChat, setSelectedChat } = Chatstate();

    const dateConvert = (item) =>  {
        const now = new Date();
        const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        let d = new Date(item.slice(0, 10));
        let out="";
        
        if (d.getFullYear() != now.getFullYear()) out += d.getFullYear() + " ";
        if (d.getMonth() != now.getMonth() && d.getDate() != now.getDate()) {
            out += month[d.getMonth()] + " ";
            out += d.getDate() + " ";
        }
        out += item.slice(11, 16); 

        return out;
    }

  return (
    <ScrollableFeed>
        {messages && messages.map((m, i) => 
            <div className={m.sender._id === user._id ? 'right-msg-body msg-body' : 'msg-body'}>
                {
                    <div className={m.sender._id === user._id ? 'right-msg msg' : 'left-msg msg'}>
                        <p>{m.content}</p>
                        <span className='msg-date'>{dateConvert(m.createdAt)}</span>
                    </div>
                }
            </div>
        )}
    {!isTyping ? <></> : 
                        <div className='msg-body'>
                            <div className='dot'>...</div>
                        </div>
                    }
    </ScrollableFeed>
  )
}

export default ScrollableChat