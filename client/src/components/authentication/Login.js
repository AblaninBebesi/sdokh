import {React, useState } from 'react'
import './authentication.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Chatstate } from "../../Context/ChatProvider"
import '../call/call.css'

const Login = () => {
  const [show, setShow] = useState(false);
  const [signin, setSignin] = useState(true);
  const [check, setCheck] = useState(false);
  const [code, setCode] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  const { user, setUser } = Chatstate();
  
  const handleClick = () => {
    setSignin(!signin);
  }
  const showHide = () => {
    setShow(!show);
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    let flag = true;
    const data = {
      email: email,
      password: password,
    }
    if (!signin) data.name = name;
    const res = await axios({
      method: 'post',
      url: `/api/user/${signin ? 'signin':'signup'}`,
      data: data
    }).catch((err)=> {
      flag = false;
      let message = signin ? "sign in error" : "sign up error";
      alert(message)
      console.log(err)
      return;
    })
    if (flag) {//alert(`${signin ? "logged in":"signed up"}`);
      setUser(res.data);
      //localStorage.setItem("userInfo", JSON.stringify(res.data));
      /*navigate('/chats'); */
      if (signin) {
      
      setCheck(true);
      sendEmail(email);
      }
      else setSignin(true);
    }
  } 

  const sendEmail = async (email) =>{
    const data = {
      email: email
    }
    const res = await axios({
      method: 'post',
      url: `/api/user/sendemail`,
      data: data
    }).catch((err)=> {
      let message = "something went wrong";
      //alert(message)
      console.log(err)
      return;
    })
    
  }

  const handleCheck = async (event) =>{
    const data = {
      email: email,
      code: code,
    }
    const res = await axios({
      method: 'post',
      url: `/api/user/verify`,
      data: data
    }).catch((err)=> {
      let message = "wrong code";
      //alert(message)
      console.log(err)
      //return;
    })
    localStorage.setItem("userInfo", JSON.stringify(user));
    navigate('/chats');
  }

  const renderLogin = () => {
    return (
      <form className=" login-form f-col">
        <div className='input-holder'>
        <label>Email</label>
        <input type="text" className="home-input login-input" name="email" required 
          onChange={(e) => setEmail(e.target.value)}></input></div>
        <div className='input-holder'>
          <label>Şifre</label>
          <input type={show ? "text" : "password"} className="home-input password-input" name="password" required 
            onChange={(e) => setPassword(e.target.value)}></input>
          <button className="show-btt" onClick={showHide}>o</button>
        </div>
        <button type="submit" className="login-btt" onClick={submitHandler}>Giriş yap</button>
      </form>
    )
  }

  const renderSignup = () => {
    return (
      <form className=" login-form f-col">
        <div className='input-holder'>
          <label for="username">Ad</label>
                  <input type="text" className="home-input login-input" name="username" required
                    onChange={(e) => setName(e.target.value)}></input></div>

      <div className='input-holder'>
        <label for="email">Email</label>
        <input type="text" className="home-input email-input" name="email" required
          onChange={(e) => setEmail(e.target.value)}></input></div>

        <div className='input-holder'>
          <label for="password">Password</label>
          <input type={show ? "text" : "password"} className="home-input password-input" name="password" required
            onChange={(e) => setPassword(e.target.value)}></input>
          <button className="show-btt" onClick={showHide}>o</button></div>
        <button type="submit" className="login-btt" onClick={submitHandler}>Kayıt ol</button>
      </form>
    )
  }

  const renderCheck = (() => {
    return(
      <form className=" login-form f-col">
      <div className='input-holder'>
        <label for="email">Kod</label>
        <input type="text" className="home-input email-input" name="code" required
          onChange={(e) => setCode(e.target.value)}></input></div>
        <button type="submit" className="login-btt" onClick={handleCheck}>Send</button>
      </form>
    )
  })

  return (
    <div>
      {signin && !check ? renderLogin() : null}
      {!signin && !check ? renderSignup() : null}
      {check ? renderCheck(): null}
      <div>
        <b>{signin ? "Don't have an account?" : "Already have an account?"}</b>
        <button className='change-btt' onClick={handleClick}>{signin ? "Kayıt ol" : "Giriş yap"}</button>
      </div>
    </div>
  )
}

export default Login