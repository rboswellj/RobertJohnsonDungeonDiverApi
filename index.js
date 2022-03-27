// Bring in the express server and create application
let express = require('express');
let app = express();
let scoreRepo = require('./repos/scoreRepo');
const auth = require("./src/routes");
let cors = require('cors');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connectDB = require("./src/db");

connectDB();


// Use the express Router object
const expressPort = '5000';
let router = express.Router();


// Configure user Middleware to support JSON data parsing in request object
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// Ping the API
router.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});

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

// GET/search?userId=n&name=str to search for users by 'userId' and/or 'name'
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

// GET/userId to return a single user
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
});

app.use("/auth", auth);

// Configure router so all routes are prefixed with /api/
app.use('/api/', router);

// Create server to listen on port 5000
var server = app.listen(expressPort, function () {
    console.log(`Node server is running on http://localhost:${expressPort}..`);
});