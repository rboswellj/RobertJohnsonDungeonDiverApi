// Bring in the express server and create application
let express = require('express');
let app = express();
let scoreRepo = require('./repos/scoreRepo');
let cors = require('cors');
const bodyParser = require('body-parser');
const basicAuth = require('./_helpers/basic_auth');
const errorHandler = require('./_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// const { auth, requiresAuth } = require('express-openid-connect');
// const connectDB = require("./src/db");



// const baseUrl = "https://arcane-waters-05689.herokuapp.com/";

// Use the express Router object
const expressPort = '5000';
let router = express.Router();
let authRoute = express.Router();


// Configure user Middleware to support JSON data parsing in request object
app.use(express.json());

// Enable CORS for all requests
app.use(cors());
authRoute.use(cors());

// Create GET to return a list of all users
router.get('/users', function (req, res, next) {
  scoreRepo.get(function (data) {
    res.status(200).json({
      "status": 200,
      "statusText": "OK",
      "message": "All scores retrieved.",
      "data": data
    });
  }, function(err) {
    next(err);
  });
});

// Create GET/search?userId=n&name=str to search for users by 'userId' and/or 'name'
router.get('/search', function (req, res, next) {
  let searchObject = {
    "userId": req.query.userId,
    "name": req.query.name,
    "userId": req.query.userId
  };
  
  scoreRepo.search(searchObject, function (data) {
    res.status(200).json({
      "status": 200,
      "statusText": "OK",
      "message": "Search for user successful.",
      "data": data
    });
  });
});

// Create GET/userId to return a single user
router.get('/user/:userId', function (req, res, next) {
  scoreRepo.getById(req.params.userId, function (data) {
    if (data) {
      res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "Single user retrieved.",
        "data": data
      });
    }
    else {
      res.status(404).send({
        "status": 404,
        "statusText": "Not Found",
        "message": "The user '" + req.params.userId + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The user '" + req.params.userId + "' could not be found."
        }
      });
    }
  }, function(err) {
    next(err);
  });
});

// router.post('/', function (req, res, next) {
//   scoreRepo.insert(req.body, function(data) {
//     res.status(201).json({
//       "status": 201,
//       "statusText": "Created",
//       "message": "New user Added.",
//       "data": data
//     });
//   }, function(err) {
//     next(err);
//   });
// })

router.put('/user/:userId', function (req, res, next) {
  scoreRepo.getById(req.params.userId, function (data) {
    if (data) {
      // Attempt to update the data
      scoreRepo.update(req.body, req.params.userId, function (data) {
        res.status(200).json({
          "status": 200,
          "statusText": "OK",
          "message": "user '" + req.params.userId + "' updated.",
          "data": data
        });
      });
    }
    else {
      res.status(404).send({
        "status": 404,
        "statusText": "Not Found",
        "message": "The user '" + req.params.userId + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The user '" + req.params.userId + "' could not be found."
        }
      });
    }
  }, function(err) {
    next(err);
  });
})

router.delete('/user/:userId', function (req, res, next) {
  scoreRepo.getById(req.params.userId, function (data) {
    if (data) {
      // Attempt to delete the data
      scoreRepo.delete(req.params.userId, function (data) {
        res.status(200).json({
          "status": 200,
          "statusText": "OK",
          "message": "The user '" + req.params.userId + "' is deleted.",
          "data": "user '" + req.params.userId + "' deleted."
        });
      });
    }
    else {
      res.status(404).send({
        "status": 404,
        "statusText": "Not Found",
        "message": "The user '" + req.params.userId + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The user '" + req.params.userId + "' could not be found."
        }
      });
    }
  }, function(err) {
    next(err);
  });
})

router.patch('/user/:userId', function (req, res, next) {
  scoreRepo.getById(req.params.userId, function (data) {
    if (data) {
      // Attempt to update the data
      scoreRepo.update(req.body, req.params.userId, function (data) {
        res.status(200).json({
          "status": 200,
          "statusText": "OK",
          "message": "user '" + req.params.userId + "' patched.",
          "data": data
        });
      });
    }
    else {
      res.status(404).send({
        "status": 404,
        "statusText": "Not Found",
        "message": "The user '" + req.params.userId + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The user '" + req.params.userId + "' could not be found."
        }
      });
    }
  }, function (err) {
    next(err);
  });
})


// use basic HTTP auth to secure the api
app.use(basicAuth);

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// Configure router so all routes are prefixed with /api/
app.use('/api/', router);

// Create server to listen on port 5000
var server = app.listen(expressPort, function () {
    console.log(`Node server is running on http://localhost:${expressPort}..`);
});