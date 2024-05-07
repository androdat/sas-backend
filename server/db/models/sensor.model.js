const mongoose = require("mongoose");

const sensorSchema = mongoose.Schema(
  {
    tower_id: {
      type: String,
      required: false,
    },
    lat: {
      type: Number,
      required: [true, "Please enter latitude"],
      default: 0,
    },
    lng: {
      type: Number,
      required: [true, "Please enter longitude"],
      default: 0,
    },
    temp: {
      type: Number,
      required: [true, "Please enter temperature"],
      default: 0,
    },
    fuel: {
      type: Number,
      required: [true, "Please enter fuel quantity"],
      default: 0,
    },
    power: {
      type: String,
      required: [true, "Please enter power source"],
    },
    anomalies: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Sensor = mongoose.model("SensorReading", sensorSchema);
module.exports = Sensor;
