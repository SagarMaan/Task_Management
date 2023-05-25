const express = require("express");
require("dotenv").config();
const route = require("./routes/route");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/", route);

app.listen(process.env.PORT, function () {
  console.log(`Express app running on ${process.env.PORT} `);
});
