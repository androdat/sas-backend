// DB
const Sensor = require("../models/sensor.model");

const handleIncomingServerData = async (sensorData) => {
  console.log("---from inside handleIncomingServerData---");
  console.log(sensorData);
  let dataArray = sensorData.sensorData;
  console.log(dataArray);
  let consecutiveGridCount = 0;
  const modifiedSensorDataArray = dataArray.map((item) => {
    console.log(item.id);
    switch (true) {
      case item.temp > 45:
        item.anomalies = true;
        break;
      case item.fuel < 20:
        item.anomalies = true;
        break;
      //   case !data.hasOwnProperty("sensorData"):
      //     console.log("sensorData is not present");
      //     break;
    }
    return item;
  });

  console.log("modifiedSensorDataArray =", modifiedSensorDataArray);

  //Insert into DB
  try {
    let insertedData = await Sensor.insertMany(modifiedSensorDataArray);
    console.log("Bulk insertion successful:", insertedData);
    //send socket event
    global.io.emit("sensorData", insertedData);
  } catch (error) {
    console.error("Error inserting sensor data:", error.message);
  }
};

const util = {
  handleIncomingServerData,
};

module.exports = util;
