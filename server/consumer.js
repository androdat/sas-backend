//Imports
const util = require("./utils/util");
const amqp = require("amqplib");

let channel, connection;

const connect = async () => {
  try {
    //Change to env later
    connection = await amqp.connect(
      "amqps://xuycmald:xXbdjVqg3z6Hz3KhA2bVzJAbaW3M4U8d@puffin.rmq2.cloudamqp.com/xuycmald"
    );
    console.log("Connected to RabbitMQ");
    channel = await connection.createChannel();
    console.log("Channel created");

    channel.consume("sensorData", (msg) => {
      const sensorData = JSON.parse(msg.content.toString());
      console.log(sensorData);
      if (sensorData.hasOwnProperty("sensorData")) {
        util.handleIncomingServerData(sensorData);
        channel.ack(msg);
      }
    });

    console.log("Waiting for messages...");
  } catch (err) {
    console.log("Connection to RabitMQ Failed");
    console.log(err);
  }
};

const consumer = {
  connect,
};

module.exports = consumer;
