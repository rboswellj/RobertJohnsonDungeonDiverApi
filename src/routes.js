// Router for express server to the mongo DB for authorization

const express = require("express");
let app = express()
let cors = require('cors');
const { check, validationResult } = require("express-validator");
const jsonFile = 'assets/dungeonDiverData.json';
const fs = require('fs');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const router = express.Router();

const User = require("../model/User");
const auth = require("../middleware/auth");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

 app.use(cors({
    origin: '*'
}));


app.post(
    "/signup",
    [
        check("userId", "Please Enter a Valid Username").not().isEmpty(),
        // check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
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
                    msg: "User Already Exists"
                });
            }

            user = new User({
                userId,
                password
            });

            // try {
            //     fs.readFile(jsonFile, (err, fileData) => {
            //         let fileObject = JSON.parse(jsonFile);
            //         console.log(fileObject);
            //     });

            // } catch (err) {
            //     console.error('read file line 65, routes.js');
            //     console.log(err);
            // }

            // let jsonData = JSON.stringify(user);

            // try {
            //     fs.writeFile(jsonFile, jsonData);
            // } catch(err) {
            //     console.error('write file line 79, routes.js');
            //     console.log(err);
            // }

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
                "randomString", {
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
            res.status(500).send("Error in Saving");
        }
    }
);

app.post(
    "/login",
    [
    //   check("email", "Please enter a valid email").isEmail(),
      check("userId", "Please enter a valid login"),
      check("password", "Please enter a valid password").isLength({
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
            message: "User Does Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
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
          message: "Server Error"
        });
      }
    }
  );
  
  app.get("/me", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });

module.exports = app;