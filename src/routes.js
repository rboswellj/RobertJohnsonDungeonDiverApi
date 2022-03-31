// Router for express server to the mongo DB for authorization

const express = require('express');
let app = express()
let cors = require('cors');
const { check, validationResult } = require('express-validator');
const jsonFile = 'assets/dungeonDiverData.json';
const fs = require('fs');

// One day in Milliseconds
const oneDay = 1000 * 60 * 60 * 24;

const session = require('cookie-session');
app.use(session({
  secret: 'mysecret',
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false 
}));
let sessionData;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const router = express.Router();

const User = require('../model/User');
const auth = require('../middleware/auth');


// Allow connection from all origins
 app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));


// Request to sign up new user to DB and store password
app.post(
    '/signup',
    [
        check('userId', 'Please Enter a Valid Username').not().isEmpty(),
        check('password', 'Please enter a valid password').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            userId,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                userId
            });
            if (user) {
                return res.status(400).json({
                    msg: 'User Already Exists'
                });
            }

            user = new User({
                userId,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                'randomString', {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Error in Saving');
        }
    }
);

// Signs in user, finds by user ID, sends encrypted password, received token as response
app.post(
    '/login',
    [
    //   check('email', 'Please enter a valid email').isEmail(),
      check('userId', 'Please enter a valid login'),
      check('password', 'Please enter a valid password').isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { userId, password } = req.body;
      try {
        let user = await User.findOne({
            userId
        });
        if (!user)
          return res.status(400).json({
            message: 'User Does Not Exist'
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: 'Incorrect Password !'
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          'randomString',
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );


      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: 'Server Error'
        });
      }
    }
  );

  // These routes deal with the session, which is used to persist login state

  app.get('/set-session', (req, res) => {
    try {
      sessionData = req.session;
      sessionData.user = {};
      sessionData.user.userId = req.query.userId;
      sessionData.user.token = req.query.token;

      // res.send(`Session for ${req.query.userId} logged, with token ${req.query.token}`);
      res.json(session.user);
    } catch(err) {
      console.error('set-session, routes.js line 170');
      console.error(err);
    }
  });

  app.get('/get-session', (req,res) => {
    try {
      sessionData = req.session;
      let userObj = {};
      if(sessionData.user) {
        userObj = sessionData.user;
      }
      // res.send('session retrieved');
      res.json(userObj);
    } catch(err) {
      console.error("get-session, routes.js line 192");
      console.error(err);
    }
  })

  app.get('/destroy-session', (req, res) => {
    try {
      sessionData = req.session;
      sessionData.destroy();
      res.status(200).send("Session destroyed");
    } catch(err) {
      console.error("destroy-session, routes.js line 202");
      console.error(err);
    }
  });
  

  // Pulls up user profile information based on token included in the header
  app.get('/me', auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ message: 'Error in Fetching user' });
    }
  });

module.exports = app;