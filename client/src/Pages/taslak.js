import React, { Component } from 'react'
import axios from 'axios'

export class Chatpage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chats: [],
    }
  }

  async fetchChats() {
    const data = await axios.get('/sandbox');
    return data.data;
  }

 

  componentDidMount() {
    this.fetchChats().then(data =>{
      this.setState({chats: data});
      console.log(this.state.chats);
    })
  }

  

  render() {
    return (
      <div>
        {this.state.chats.map((item, index) => (
          <div key={index}>{item.chatName}</div> // теперь мы возвращаем каждый элемент
        ))}
      </div>
    );
  }
}


export default Chatpage