import  { useEffect } from 'react'
import { CloseIcon } from "../../svg"
import { Chatstate } from '../../Context/ChatProvider'
import { getSender } from '../../config/ChatLogics'


export default function Header ({call, endCall}) {
      const { user, selectedChat} = Chatstate();
  useEffect(() => {

    }, [call]);
    return (
    <div className='call-header'>
        {true && <button onClick={() => endCall()}className="call-action btn-transparent">
        <CloseIcon className='return-icon'/>
              </button>}
        <div className='header-content'>
        <div>{getSender(user, selectedChat.users)}</div>
        </div>
    </div>)
}