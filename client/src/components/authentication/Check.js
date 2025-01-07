import {React, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Chatstate } from "../../Context/ChatProvider"

export class Check extends Component {
  render() {
    return (
      <div>
    <form className=" login-form f-col">
      <div className='input-holder'>
        <label for="email">Code</label>
        <input type="text" className="home-input email-input" name="code" required
          onChange={(e) => setCode(e.target.value)}></input></div>
        <button type="submit" className="login-btt" onClick={handleCheck}>Send</button>
      </form>

      </div>
    )
  }
}

export default Check