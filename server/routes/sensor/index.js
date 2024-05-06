const { Router } = require("express");

const router = Router();

// Controllers
const sensorController = require("../../controlers/sensor.controller");

router.route("/sensor").get(sensorController.getAllSensorData);
router.route("/sensor/anomalies").get(sensorController.getAllAnomaliesSensorData);
router.route("/sensor").delete(sensorController.deleteAll);
module.exports = router;
