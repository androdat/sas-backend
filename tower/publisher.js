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
    const result = await channel.assertQueue("sensorData", {
      durable: false,
    });
    console.log("Queue asserted");
  } catch (err) {
    console.log("Connection to RabitMQ Failed");
    console.log(err);
  }
};

const sendMessageToQue = (data) => {
  try {
    channel.sendToQueue("sensorData", Buffer.from(JSON.stringify(data)));
    console.log("Sent Successfully");
    return true;
  } catch (err) {
    console.log(err);
  }
};

const closeConnection = async () => {
  console.log("Closing channel...");
  await channel.close();

  console.log("Closing connection...");
  await connection.close();
  return true;
};

const publisher = {
  connect,
  closeConnection,
  sendMessageToQue,
};

module.exports = publisher;
