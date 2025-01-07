import './App.css';
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Chatpage from './Pages/Chatpage'

function App() {

  return (
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/chats' element={ <Chatpage /> } />
      </Routes>
  );
}

export default App;
