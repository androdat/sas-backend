// DB
const Sensor = require("../db/models/sensor.model");

const getAllSensorData = async (req, res) => {
  try {
    const sensorData = await Sensor.find({});
    if (sensorData.length > 0) {
      res.status(200).json({
        success: true,
        message: "Sensor readings retrieved successfully",
        sensorData,
      });
    } else {
      //No sensor data is found
      res.status(404).json({
        success: false,
        message: "No sensor readings found",
      });
    }
  } catch (err) {
    console.log("Error retrieving sensor data:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while retrieving sensor data",
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const { deletedCount } = await Sensor.deleteMany({});
    if (deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: `${deletedCount} sensor readings deleted successfully`,
      });
    } else {
      // No records were deleted
      res.status(404).json({
        success: false,
        message: "No sensor readings found to delete",
      });
    }
  } catch (err) {
    console.log("Error deleting sensor readings:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while deleting sensor readings",
    });
  }
};

const getAllAnomaliesSensorData = async (req, res) => {
  try {
    const sensorData = await Sensor.find({ anomalies: true });
    if (sensorData.length > 0) {
      res.status(200).json({
        success: true,
        message: "Sensor readings with anomalies retrieved successfully",
        sensorData,
      });
    } else {
      //No sensor data is found
      res.status(404).json({
        success: false,
        message: "No sensor readings with anomalies found",
      });
    }
  } catch (err) {
    console.log("Error retrieving sensor data with anomalies:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error occurred while retrieving sensor data with anomalies",
    });
  }
};

const sensorController = {
  getAllSensorData,
  deleteAll,
  getAllAnomaliesSensorData
};

module.exports = sensorController;
