require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const userRouter=require("./Routes/user.js");
const cors = require("cors");

const MONGO_URL =process.env.ATLAS_URL;

// const URL = "mongodb://127.0.0.1:27017/rideit";
const URL ="mongodb+srv://yashveersingh9897:yuQD0CuIiZ2PTtgO@cluster0.f4jiyuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


async function main() {
  try {
    await mongoose.connect(URL);
    console.log("Connected to db");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
main();

app.use(cors()); 


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is running!!");
});

app.use("/rideit/auth",userRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is listening at port 8080");
});



