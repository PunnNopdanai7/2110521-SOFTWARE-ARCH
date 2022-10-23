const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
