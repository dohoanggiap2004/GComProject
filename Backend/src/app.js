require("dotenv").config();
const express = require("express");
const http = require('http');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const route = require("./routers/index");
const passport = require('passport')
//middlewars || configs
const { errorHandler } = require("./middlewares/errorHandler");
const { logger } = require("./middlewares/logEvents");
const corsOptions = require("./config/corsOptions");
const localPassport = require('./config/localPassport')
const googlePassport = require('./config/googlePassport')
const { connectDB } = require('./config/mongooseConnect')
const initialSocket = require("./config/socket.io");
const cronMail = require('./config/cron')

const app = express();
const port = process.env.PORT || 3500
const server = http.createServer(app);

//connect to db
connectDB()

//cron send mail
cronMail.start()

// Custom middleware Logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// build-in middleware to handle urlencode from data
app.use(express.urlencoded({ extended: true }));

// build-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, '../../Frontend/dist')));

//authenticate via passportjs
localPassport()
googlePassport()
app.use(passport.initialize());

//init socket server
initialSocket(server)

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
});

//route
route(app);

// Custom Middleware Error Logger
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
