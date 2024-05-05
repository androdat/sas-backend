const amqp = require("amqplib");

let channel, connection;
const msg = { number: 2 };
const connect = async () => {
  try {
    connection = await amqp.connect(
      "amqps://xuycmald:xXbdjVqg3z6Hz3KhA2bVzJAbaW3M4U8d@puffin.rmq2.cloudamqp.com/xuycmald"
    );
    channel = await connection.createChannel();
    const result = await channel.assertQueue("sensorData", {
      durable: false,
    });
    channel.sendToQueue("sensorData", Buffer.from(JSON.stringify(msg)));
    console.log("Sent Successfully");
  } catch (err) {
    console.log(err);
  }
};
connect()
