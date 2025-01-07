import React, { Component, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Login from '../components/authentication/Login'
import Chatpage from '../Pages/Chatpage';
import './pages.css'

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate('/chats');
  }, [navigate]);

  return (
    <div className="homepage f-col f-center">
      <div className="home-header"><h1>Blue Tit Bird</h1></div>
      <div className="home-login glass-effect">
      <Login />
      </div>
    </div>
  )
}
export default Home