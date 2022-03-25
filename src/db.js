
const mongoose = require('mongoose');

const mongoLocal =
  `mongodb://localhost:27017/dungeon-diver`;

async function connectDB() {
    try {
        // Connect to the MongoDB cluster
        mongoose.connect(
          mongoLocal,
          () => console.log(" Mongoose is connected"),
        );
      } catch (e) {
        console.log("could not connect");
        console.log(`error: ${e}`)
      }
}

console.log(`Mongoose Ready: ${mongoose.connection.readyState}`);

module.exports = connectDB