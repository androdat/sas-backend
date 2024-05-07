// DB
const Sensor = require("../db/models/sensor.model");
const handleIncomingServerData = async (sensorData) => {
  let dataArray = sensorData.sensorData;
  let anomalieData = [];
  const modifiedSensorDataArray = dataArray.map((item) => {
    switch (true) {
      case item.temp > 45:
        item.anomalies = true;
        anomalieData.push(item);
        break;
      case item.fuel < 20:
        item.anomalies = true;
        anomalieData.push(item);
        break;
      default:
        item.anomalies = false;
    }
    return item;
  });

  //Retrieve last 20 sec records for this tower and check if one electric is present if yes then not an anomalie
  //My asumption is 2hrs = 20sec
  let isAnAnomalie = false;
  let oldData;
  for (const item of modifiedSensorDataArray) {
    try {
      // Calculate the timestamp for 20 seconds ago
      var twentySecondsAgo = new Date();
      twentySecondsAgo.setSeconds(twentySecondsAgo.getSeconds() - 20);

      oldData = await Sensor.find({
        createdAt: { $gt: twentySecondsAgo },
        tower_id: item.tower_id,
      });

      if (oldData.length > 0) {
        for (const entry of oldData) {
          if (entry.power.toLowerCase() === "electric") {
            isAnAnomalie = false; // If electric power found
            break;
          } else {
            isAnAnomalie = true; // If no electric power found, return false
          }
        }
      }
    } catch (error) {
      console.error("Error fetching old data:", error);
    }
    if (oldData.length > 0) {
      item.anomalies = isAnAnomalie;
    }

    if (item.anomalies) {
      anomalieData.push(item);
    }
  }

  //Insert into DB
  let insertedData;
  try {
    insertedData = await Sensor.insertMany(modifiedSensorDataArray);
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
    global.io.emit("sensorDataWithAnomalies", {
      eventName: "sensorDataWithAnomalies",
      data: anomalieData,
    });
  }
};

const util = {
  handleIncomingServerData,
};

module.exports = util;
