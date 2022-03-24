
const mongoose = require('mongoose');

const mongoAtlasUri =
  "mongodb+srv://rboswellj:Jerkstore7!@cluster0.wwvww.mongodb.net/dungeon-diver.users";

async function connectDB() {
    try {
        // Connect to the MongoDB cluster
        mongoose.connect(
          mongoAtlasUri,
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => console.log(" Mongoose is connected"),
        );
      } catch (e) {
        console.log("could not connect");
      }
}

module.exports = connectDB



// try {
//   // Connect to the MongoDB cluster
//   mongoose.connect(
//     mongoAtlasUri,
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => console.log(" Mongoose is connected"),
//   );
// } catch (e) {
//   console.log("could not connect");
// }

// const dbConnection = mongoose.connection;
// dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
// dbConnection.once("open", () => console.log("Connected to DB!"));