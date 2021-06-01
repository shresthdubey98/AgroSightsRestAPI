const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const userRouter = require("./routes/user");
const qaRouter = require("./routes/qa");
const chatRouter = require('./routes/chat');
const mime = require('mime-types');
const app = express();
const server = http.createServer(app);

//attaching socketio to server
// const io = require('socket.io').listen(server);
// io.of('/chat').on('connection', require('./util/chatsocket').chatHandler)
require('./util/chatsocket').chatHandler(server);

app.use(bodyParser.json()); // for application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Uncomment for static serving 
app.use('/media/images', express.static(path.join(__dirname, 'media', 'images')));
app.use('/media/message-media', express.static(path.join(__dirname, 'media', 'message-media')));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/user', userRouter);
app.use((req, res, next) => {
  const jwtTokenRaw = req.headers.authorization;

  if (!jwtTokenRaw) {
    const error = new Error('No token attached');
    error.statusCode = 403;
    throw error;
  }
  jwtToken = jwtTokenRaw.split(' ')[1]
  let deocdedData;
  try {
    decodedData = jwt.verify(jwtToken, require('./util/configs').jwtSecret);
  } catch (err) {
    err.statusCode = 403;
    throw err;
  }
  req.auth = {
    email: decodedData.email,
    userId: decodedData.userId
  };
  next();
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, path.join('media', 'images'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() +'.'+ mime.extension(file.mimetype));
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ){
    cb(null, true);
  }else{
    const err = new Error("Unsupported file format");
    err.statusCode = 415;
    cb(err, false);
  }
}
app.use(
  multer({storage: fileStorage, fileFilter:fileFilter,}).fields([
    {name:'image1',maxCount: 1},
    {name:'image2',maxCount: 1},
    {name:'image3',maxCount: 1},
    {name:'image4',maxCount: 1},
    {name:'image5',maxCount: 1}
  ])
  );
// app.use('/demo',(req, res, next)=>{
//   console.log(req.files);
//   console.log(req.body);
//   res.status(200).json({
//     message: "mil gayi"
//   });
// });
// app.use((req, res, next)=>{
//   console.log(req.files);
//   res.status(200).json({files: req.files, body:req.body});
// });
app.use('/qa', qaRouter);
app.use('/chat',chatRouter);
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
server.listen(5000,()=>{
  console.log("Server Started at port : 5000")
});