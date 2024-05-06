// DB
const Sensor = require("../db/models/sensor.model");

const handleIncomingServerData = async (sensorData) => {
  console.log("---from inside handleIncomingServerData---");
  console.log(sensorData);
  let dataArray = sensorData.sensorData;
  console.log(dataArray);
  let anomalieData = [];
  const modifiedSensorDataArray = dataArray.map((item) => {
    console.log(item.id);
    switch (true) {
      case item.temp > 45:
        item.anomalies = true;
        anomalieData.push(item);
        break;
      case item.fuel < 20:
        item.anomalies = true;
        anomalieData.push(item);
        break;
      //   case !data.hasOwnProperty("sensorData"):
      //     console.log("sensorData is not present");
      //     break;
      default:
        item.anomalies = false;
    }
    return item;
  });

  console.log("modifiedSensorDataArray =", modifiedSensorDataArray);



  //Insert into DB
  try {
    let insertedData = await Sensor.insertMany(modifiedSensorDataArray);
    console.log("Bulk insertion successful:", insertedData);
    //send socket event
    global.io.emit("sensorData", {
      eventName: "sensorData",
      data: insertedData,
    });
  } catch (error) {
    console.error("Error inserting sensor data:", error.message);
  }

    //Send alarm to frontend if any anomalies detected first 2 cases
    if (anomalieData.length > 0) {
      console.log("----anomalieData----", anomalieData);
      global.io.emit("sensorDataWithAnomalies", {
        eventName: "sensorDataWithAnomalies",
        data: anomalieData,
      });
    }

  //Check third Anomalie
  // Query MongoDB to get the previous sensor data for 2 minutes taking asumption 2hrs = 2mins
  const currentTime = new Date();
  const startTime = new Date(currentTime);
  startTime.setMinutes(startTime.getMinutes() - 2);

  const previousSensorData = await Sensor.find({
    power: "DG",
    createdAt: { $gte: startTime, $lte: currentTime },
  });
  console.log("---3rd case---");
  console.log(previousSensorData);
  if (previousSensorData.length > 0) {
    console.log("updating...");
    await Sensor.updateMany(
      {
        _id: { $in: previousSensorData.map((data) => data._id) },
      },
      { $set: { anomalies: true } }
    );

    // Retrieve the updated sensor readings
    const updatedSensorReadings = await Sensor.find({
      _id: { $in: previousSensorData.map((data) => data._id) },
    });
    //If anomalies detected for last 2 mins ie power source is DG send socket event
    global.io.emit("sensorData", {
      eventName: "powerAnomalie",
      data: updatedSensorReadings,
    });
  }
};

const util = {
  handleIncomingServerData,
};

module.exports = util;
