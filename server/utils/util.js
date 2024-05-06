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

  //Send alarm to frontend if any anomalies detected
  if (anomalieData.length > 0) {
    console.log("----anomalieData----", anomalieData);
    global.io.emit("sensorDataWithAnomalies", {
      eventName: "sensorDataWithAnomalies",
      data: anomalieData,
    });
  }

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
};

const util = {
  handleIncomingServerData,
};

module.exports = util;
