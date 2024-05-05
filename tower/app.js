// Packages
const express = require("express");
const PORT = process.env.PORT || 2000;

const app = express();

// Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("Security Alarm System Backend up and running...");
});

app.listen(PORT, () => {
  console.log(`Running on port = ${PORT}`);
});
