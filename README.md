# sas-backend
## Steps to run the application
there are 2 servers to run <br>
1. tower server<br>
cd tower<br>
npm i <br>
npm run dev <br>

2. main server <br>
cd server <br>
npm i <br>
npm run dev <br>

## Backend Routes
tower<br>
GET http://localhost:2000/tower to publish a single sensor data on RabbitMQ<br>
GET http://localhost:2000/tower/test to publish sensor data form json file on RabbitMQ to create 3rd anomaly case<br>
GET http://localhost:2000/tower/disconnect to disconnect channel from RabbitMQ<br>

main server<br>
GET http://localhost:4000/sensor to get all sensor reading with/without anomalies<br>
GET http://localhost:4000/sensor/anomalies to get sensor reading with anomalies<br>
DELETE http://localhost:4000/sensor to delete all sensor readings<br>
