import { React, useState, useEffect } from 'react'
import './header.css'
import { Chatstate } from '../../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const Header = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    
    const { user, setSelectedChat, chats, setChats } = Chatstate();
    const navigate = useNavigate();

    const logout = (() => {
        localStorage.removeItem("userInfo");
        setLoading(false);
        navigate('/');
    })

    const handleSearch = (async (event) => {
        event.preventDefault();
        if (!search) setSearchResult([]);
        if(search) {
            try {
                setLoading(true);
                const config = {
                    headers: {
                        authorization: `Bearer ${user.token}`,
                    }
                }
                const { data } = await axios.get(`/api/user?search=${search}`, config);
                //if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
                setLoading(false);
                setSearchResult(data);
            } catch(err) {
                alert('failed to reach the search result');
            }
        }
    })

    const accessChat = (async(userId) => {
        const config = {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${user.token}`,
            }
        }
        try {
            setLoadingChat(true);
            const { data } = await axios.post('/api/chat/', {userId}, config);
            setSelectedChat(data);
            setLoadingChat(false);
        } catch (err) {
            alert('failed to open a chat');
        }
    })

    return (
        <div className="header">
            <div className="dropdown-label search-label">
                <p>Search</p>
                <div className="dropdown search-dropdown">
                    <form className="user-search">
                        <input className="search-input" onChange={ (e) => setSearch(e.target.value)} name="search">
                        </input>
                        <span className="header-btn" onClick = { handleSearch }>Search for someone</span>
                    </form>
                    <div className="user-list">
                    {loading ? (<div>Loading...</div>) : (
                        searchResult.map(user => 
                            <div className="search-user" key={user._id}>
                                {user.name}
                                <button className="call-btt" onClick={() => accessChat(user._id)}>Go to chat</button>
                            </div>
                        )
                    )}
                    </div>
                </div>
            </div>
            <h3 className="header-title">Blue Tit Bird</h3>
            <div className="dropdown-label profile-label">
                <p>Profile</p>
                <div className="dropdown profile-dropdown">
                    <span onClick={logout} className="header-btn">logout</span>
                </div>
            </div>
        </div>
    )
}

export default Header;