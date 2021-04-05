const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// const { static } = require('express');  // Uncomment for static serving
const userRouter = require("./routes/user");

const app = express();

app.use(bodyParser.json()); // for application/json
app.use(bodyParser.urlencoded({extended: true}));

// Uncomment for static serving 
// app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/user',userRouter);
app.use((req, res, next)=>{
  const jwtTokenRaw = req.headers.authorization;

  if (!jwtTokenRaw){
    const error = new Error('No token attached');
    error.statusCode = 403;
    throw error;
  }
  jwtToken = jwtTokenRaw.split(' ')[1]
  let deocdedData;
  try{
    decodedData = jwt.verify(jwtToken, require('./util/configs').jwtSecret);
  }catch(err){
    err.statusCode = 403;
    throw err;
  }
  req.auth = {
    email: decodedData.email,
    userId: decodedData.userId
  };
  
  next();
});
app.use((req, res, next)=>{
  console.log(req);
  res.status(200).json({req:"recievd"});
});
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(5000);


