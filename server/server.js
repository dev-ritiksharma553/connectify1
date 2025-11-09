const express = require('express');
// const app = express();
const cookieParser = require('cookie-parser');
const db = require('./utils/db');
const userRoutes = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const messageRouter = require('./routes/messageRoutes')
const cors = require('cors');

const {app,server} = require('./socket/socket')

require('dotenv').config();


// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin: "http://localhost:5173",  // frontend URL
    credentials: true                 // allow cookies
}));


app.use('/user',userRoutes);
app.use('/post',postRouter);
app.use('/message',messageRouter)



app.get('/',(req,res)=>{
    res.send('hello to my insta clone')
})

server.listen(7000,(req,res)=>{
    db();
    console.log(`Server is listining on Port ${process.env.PORT}`)
})

