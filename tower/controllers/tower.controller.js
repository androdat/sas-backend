//Imports
const { v4: uuidv4 } = require("uuid");
const publisher = require("../publisher");
const testData = require("./test.json");

const createSingle = async (req, res) => {
  let sensorData = {
    tower_id: uuidv4(),
    lat: Math.floor(Math.random() * 181) - 90,
    lng: Math.floor(Math.random() * 361) - 180,
    temp: Math.floor(Math.random() * 50),
    fuel: Math.floor(Math.random() * 50),
    power: Math.random() < 0.5 ? "DG" : "Electric",
  };

  let queData = { sensorData: [sensorData] };
  console.log(queData);

  const result = publisher.sendMessageToQue(queData);
  console.log("result =", result);
  if (result)
    res.status(200).send({
      success: true,
      message: "Sensor data published on que",
    });
  else res.status(500).json({ error: "Internal Server Error" });
};

const createAnomalie = async (req, res) => {
  const { type } = req.body;
  if (!type) {
    res.status(400).json({ error: "Request body is missing" });
    return;
  }
  console.log("type = ", type);
  let postData;
  switch (type) {
    case "1":
      //with anomalie temp > 45 rest is constant
      let sensorDataFirstAnomalie = {
        tower_id: uuidv4(),
        lat: Math.floor(Math.random() * 181) - 90,
        lng: Math.floor(Math.random() * 361) - 180,
        temp: Math.floor(Math.random() * 5) + 46,
        fuel: 25,
        power: "Electric",
      };
      console.log("sensorDataFirstAnomalie = ", sensorDataFirstAnomalie);
      postData = [sensorDataFirstAnomalie];
      break;
    case "2":
      //with anomalie fule < 20 rest is constant
      let sensorDataSecondAnomalie = {
        tower_id: 1,
        lat: Math.floor(Math.random() * 181) - 90,
        lng: Math.floor(Math.random() * 361) - 180,
        temp: 20,
        fuel: Math.floor(Math.random() * 20),
        power: "Electric",
      };
      console.log("sensorDataSecondAnomalie = ", sensorDataSecondAnomalie);
      postData = [sensorDataSecondAnomalie];
      break;
    case "3":
      //if fuel is DG for past 2 hours ie last 5 reading basically produce last 5 readings with fuel as DG Deprecated
      const sensorDataThirdAnomalie = Array.from({ length: 5 }, () => ({
        tower_id: 1,
        lat: Math.floor(Math.random() * 181) - 90,
        lng: Math.floor(Math.random() * 361) - 180,
        temp: Math.floor(Math.random() * 50),
        fuel: Math.floor(Math.random() * 50),
        power: "DG",
      }));
      console.log("sensorDataThirdAnomalie = ", sensorDataThirdAnomalie);
      postData = sensorDataThirdAnomalie;
      break;
    default:
      res
        .status(422)
        .json({ error: "Unprocessable entity: Request body is missing" });
  }

  console.log("postData", postData);

  let queData = { sensorData: [...postData] };
  console.log(queData);

  const result = publisher.sendMessageToQue(queData);
  console.log("result =", result);
  if (result)
    res.status(200).send({
      success: true,
      message: "Sensor data with anomalies published on que",
      queData,
    });
  else res.status(500).json({ error: "Internal Server Error" });
};

const disconnect = (req, res) => {
  const result = publisher.closeConnection();
  if (result)
    res.status(200).send({
      success: true,
      message: "Disconnected from RabitMQ",
    });
  else res.status(500).json({ error: "Internal Server Error" });
};

const createPowerAnomalie = async (req, res) => {
  async function iterateData() {
    const tower1Data = testData["tower 1"];
    const tower2Data = testData["tower 2"];

    for (let i = 0; i < tower1Data.length || i < tower2Data.length; i++) {
      if (tower1Data[i]) {
        console.log("Tower 1 Data:", tower1Data[i]);
        let queData = { sensorData: [tower1Data[i]] };
        const result = publisher.sendMessageToQue(queData);
        await sleep(5000); // Wait for 5 seconds
      }
      if (tower2Data[i]) {
        console.log("Tower 2 Data:", tower2Data[i]);
        let queData = { sensorData: [tower2Data[i]] };
        const result = publisher.sendMessageToQue(queData);
        await sleep(5000); // Wait for 5 seconds
      }
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  iterateData();

  res.status(200).send({
    message: "Started Publishing Anomalie Data",
  });
};

const towerController = {
  createSingle,
  createAnomalie,
  disconnect,
  createPowerAnomalie,
};

module.exports = towerController;
