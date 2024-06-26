const { Router } = require("express");

const router = Router();

//Controllers
const towerController = require("../../controllers/tower.controller");

router.route("/tower").get(towerController.createSingle);
router.route("/tower").post(towerController.createAnomalie);
router.route("/tower/disconnect").get(towerController.disconnect);
router.route("/tower/test").get(towerController.createPowerAnomalie);
module.exports = router;
