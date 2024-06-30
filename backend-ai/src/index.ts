require('dotenv').config()

import express from "express";
import {registerRoutes} from "./routes/index";


import Configuration from "./ai-modeling/configuration";
import { ModelBuilder } from "./ai-modeling/modelBuilder";
import {SensorInputFetcher , RabbitMQConfig, SensorConfig} from "./data-exchanger/sensor_input_fetcher";
import ApplicationContext from "./applicationContext";
import { AccumulatorInputSender } from "./data-exchanger/accumulator_input_sender";

const configuration = new Configuration();

const modelBuilder = new ModelBuilder();

const aiConfiguration = configuration.aiConfig;




const app = express();
const port = 3000;  


const rabbitConfig = new RabbitMQConfig(process.env.RABBITMQ_USER!, process.env.RABBITMQ_PASSWORD!, process.env.RABBITMQ_HOST!, process.env.RABBITMQ_PORT!);
const sensorConfig = SensorConfig.fromFile(process.env.SENSOR_CONFIG_FILE!);
const fetcher = new SensorInputFetcher(rabbitConfig, sensorConfig);
const accumulatorInputSender = new AccumulatorInputSender(rabbitConfig);

accumulatorInputSender.connect();

const applicationContext = new ApplicationContext(sensorConfig, configuration);


// register routes
registerRoutes(app, applicationContext);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

fetcher.start();

// start ai model
modelBuilder.runModel(aiConfiguration, sensorConfig, accumulatorInputSender);