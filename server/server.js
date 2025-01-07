const express = require('express');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 8080;
const { chats } = require('./data/data');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const connectDB = require('./config/db');
const cors = require('cors');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const path = require('path')

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'], 
    credentials: true 
}));

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.get('/sandbox', (req, res) => {
    res.send(chats);
})

//----IM IN LOVE WITH AUBREY PLAZA----
const __dirname1 = path.resolve();
if (/*process.env.NODE_ENV==='production'*/ true) {
  app.use(express.static(path.join(__dirname1,'/client/build')));
  app.get('*',(req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else{
  app.get('/', (req, res) => {
    res.send("Хватит с меня задушу себя ремнем");
})
}
//----IM IN LOVE WITH AUBREY PLAZA----

app.get('/sandbox/:id', (req, res) => {
    const chat = chats.find((c) => c._id === req.params.id);
    res.send(chat);
})

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, console.log(`Сервер поднят на порт ${PORT}`)); 

const io = require('socket.io')(server, {
    pingTumeout: 60000,
    cors: {
        origin: "http://127.0.0.1:3000",
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
      socket.emit('setup socket', socket.id)
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    //---answer call
    socket.on("answer call", (data) => {
      io.to(data.to).emit("call accepted", data.signal);
    });
  
    //---end call
    socket.on("end call", (id) => {
      io.to(id).emit("end call");
    });
  
    socket.on("call user", (data) => {
      //console.log(data);
      let userId = data.userToCall;
      io.to(userId).emit("call user", {
        signal: data.signal,
        name: data.name,
        from: data.from,
      });
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
    
  });


