import ApplicationContext from "../applicationContext";
import { ActuatorInputSender } from "../data-exchanger/actuator_input_sender";
import { SensorConfig } from "../data-exchanger/sensor_input_fetcher";
import { Iterations, Model, State, StateTransition } from "./ai-components";
import Actuator from "./configuration/actuator";

class ModelBuilder {
    buildModel(conf: AiConfiguration, sensorConfig: SensorConfig) {
        return new Model(conf.states, conf.transitions, sensorConfig);
    }

    runModel(conf: AiConfiguration, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender, applicationContext: ApplicationContext){
        // build the model based on the configuration
        let model = this.buildModel(conf, sensorConfig);

        let enableLog = conf.enableLog;
   

        let opts = {
            enableLog: enableLog
        }

        // setup the model instance
        let iterations = new Iterations(model, conf.initValues, conf.initState, actuatorInputSender, opts);

        // start the ticker
        conf.ticker(iterations, applicationContext);

    }
}

interface AiConfiguration{
    states : State<any>[];
    transitions : StateTransition[];
    ticker: (iterations: Iterations, appContext: ApplicationContext) => Promise<void>;
    initState: State<any>;
    initValues: Map<string, any>;
    enableLog: boolean;
    accumalators: Actuator<any>[];
}

export {ModelBuilder, AiConfiguration};