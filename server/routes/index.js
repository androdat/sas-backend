const { Router } = require("express");

// routers
const sensor = require("./sensor");

const router = Router();

// Security Alarm System (sas) routes
router.use("/", sensor);


module.exports = router;
