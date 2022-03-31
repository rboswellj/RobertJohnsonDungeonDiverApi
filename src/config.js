// config.js

let config = {
    dbPort: 27017,
    localDbUrl: "mongodb://localhost:27017/dungeon-diver",
    dbUrl: process.env.MONGODB_URI,
    apiServerPort: `5000`,
    appServerPort: `8080`,
    jsonFile: 'assets/dungeonDiverData.json'
    };

  module.exports = config;