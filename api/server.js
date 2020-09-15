const express = require("express");
const helmet = require("helmet");
// const cors = require("cors");
const bcryptjs = require("bcryptjs");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router.js");
const connection = require("../database/connection.js");
const protected = require('../auth/protectedMiddleWare')

const server = express();

const sessionConfig = {
    name: 'monster',
    secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe!',
    resave: false,
    saveUninitialized: true, // ask the client if it's ok to save cookies (GDPR compliance)
    cookie: {
      maxAge: 1000 * 60 * 60, // in milliseconds
      secure: process.env.USE_SECURE_COOKIES || false, // true means use only over https connections
      httpOnly: true, // true means the JS code on the clients CANNOT access this cookie
    },
    store: new KnexSessionStore({
      knex: connection, // knex connection to the database
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60, // remove expired sessions every hour
    })
  }

server.use(helmet());
server.use(express.json());
// server.use(cors());
server.use(session(sessionConfig)); // turn on sessions

server.use("/api/users", protected, usersRouter);
server.use("/api/auth", authRouter);



server.get("/", (req, res) => {

  res.status(200).json({ server: "up"})
});


// function protected(req, res, next){
//     if(req.session.username){
//         next();
//     } else {
//       res.status(401).json({ you: "cannot pass!"})
//     }
//   }

module.exports = server;
