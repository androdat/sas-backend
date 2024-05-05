const { Router } = require("express");

// routers
const towerRoutes = require("./tower-routes");

const router = Router();

// Tower routes
router.use("/", towerRoutes);


module.exports = router;
