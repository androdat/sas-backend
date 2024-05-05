//Imports
const consumer = require("./consumer");
// Packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
//const io = new Server(server);
global.io = new Server(server);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes imports
// const apiRoutes = require("./routes/index");

//sockets
io.on("connection", (socket) => {
  console.log("a new user connected", socket.id);
  socket.emit("testData", "Test data from socket server");
});

app.get("/", (req, res) => {
  res.status(200).send("Security Alarm System Backend up and running...");
});

mongoose
  .connect(
    "mongodb+srv://androdat:1234@task.ubmnwno.mongodb.net/?retryWrites=true&w=majority&appName=Task"
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => {
    console.log(`MongoDB Connecttion Failed! ${err}`);
  });

// Routes
// app.use("/", apiRoutes);
server.listen(PORT, () => {
  console.log(`Running on port = ${PORT}`);
});
consumer.connect();