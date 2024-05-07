// DB
const Sensor = require("../db/models/sensor.model");
const handleIncomingServerData = async (sensorData) => {
  console.log("---from inside handleIncomingServerData---");
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
  let isAnAnomalie = false;
  for (const item of modifiedSensorDataArray) {
    console.log("item from array", item);
    try {
      // Calculate the timestamp for 20 seconds ago
      var twentySecondsAgo = new Date();
      twentySecondsAgo.setSeconds(twentySecondsAgo.getSeconds() - 20);

      const oldData = await Sensor.find({
        createdAt: { $gt: twentySecondsAgo },
        tower_id: item.tower_id,
      });

      console.log("oldData", oldData);
      if (oldData.length > 0) {
        for (const entry of oldData) {
          console.log("old entry", entry);
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
    item.anomalies = isAnAnomalie;
    if (item.anomalies) {
      anomalieData.push(item);
    }
    console.log("isAnAnomalie", isAnAnomalie);
    console.log("ITEM OF MODIFIED modifiedSensorDataArray", item);
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
    console.log("----anomalieData----", anomalieData);
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
