require('dotenv').config()

import express from "express";


import Configuration from "./ai-modeling/configuration";
import { ModelBuilder } from "./ai-modeling/modelBuilder";
import {SensorInputFetcher , RabbitMQConfig, SensorConfig} from "./data-analyser/sensor_input_fetcher";

const configuration = new Configuration();

const modelBuilder = new ModelBuilder();

const aiConfiguration = configuration.configure();


const app = express();
const port = 3000;  


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const rabbitConfig = new RabbitMQConfig(process.env.RABBITMQ_USER!, process.env.RABBITMQ_PASSWORD!, process.env.RABBITMQ_HOST!, process.env.RABBITMQ_PORT!);
const sensorConfig = SensorConfig.fromFile(process.env.SENSOR_CONFIG_FILE!);
const fetcher = new SensorInputFetcher(rabbitConfig, sensorConfig);
fetcher.start();

// start ai model
modelBuilder.runModel(aiConfiguration);