import express from "express";


import Configuration from "./ai-modeling/configuration";
import { ModelBuilder } from "./ai-modeling/modelBuilder";

const configuration = new Configuration();

const modelBuilder = new ModelBuilder();

const aiConfiguration = configuration.configure();


const app = express();
const port = 3000;  


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// start ai model
modelBuilder.runModel(aiConfiguration);