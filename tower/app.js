//Imports
const publisher = require("./publisher");
const msg = { number: 2 };
// Packages
const express = require("express");
const PORT = process.env.PORT || 2000;

const app = express();

// Middlewares
app.use(express.json());

// Routes imports
const apiRoutes = require("./routes/index");

// Routes
app.use("/", apiRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Tower Backend up and running...");
});

app.listen(PORT, () => {
  console.log(`Running on port = ${PORT}`);
});

// Event handler for server close
app.on('close', () => {
    console.log('Server closed');
    publisher.closeConnection();
    // Perform cleanup tasks or other actions here
  });
publisher.connect();
