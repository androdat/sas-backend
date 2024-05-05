//Imports
const { v4: uuidv4 } = require("uuid");
const publisher = require("../publisher");

const createSingle = async (req, res) => {
  let sensorData = {
    id: uuidv4(),
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
      msg: "Sensor data published on que",
      queData,
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
        id: uuidv4(),
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
        id: 1,
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
      //if fuel is DG for past 2 hours ie last 5 reading basically produce last 5 readings with fuel as DG
      const sensorDataThirdAnomalie = Array.from({ length: 5 }, () => ({
        id: 1,
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
      msg: "Sensor data with anomalies published on que",
      queData,
    });
  else res.status(500).json({ error: "Internal Server Error" });
};

const towerController = {
  createSingle,
  createAnomalie,
};

module.exports = towerController;
