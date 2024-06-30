import { AccumulatorInputSender } from "../data-exchanger/accumulator_input_sender";
import { SensorConfig } from "../data-exchanger/sensor_input_fetcher";
import { Iterations, Model, State, StateTransition } from "./ai-components";
import Accumulator from "./configuration/accumulator";

class ModelBuilder {
    buildModel(conf: AiConfiguration, sensorConfig: SensorConfig) {
        return new Model(conf.states, conf.transitions, sensorConfig);
    }

    runModel(conf: AiConfiguration, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender){
        // build the model based on the configuration
        let model = this.buildModel(conf, sensorConfig);

        let enableLog = conf.enableLog;
   

        let opts = {
            enableLog: enableLog
        }

        // setup the model instance
        let iterations = new Iterations(model, conf.initValues, conf.initState, accumulatorInputSender, opts);

        // start the ticker
        conf.ticker(iterations);

    }
}

interface AiConfiguration{
    states : State<any>[];
    transitions : StateTransition[];
    ticker: (iterations: Iterations) => Promise<void>;
    initState: State<any>;
    initValues: Map<string, any>;
    enableLog: boolean;
    accumalators: Accumulator[];
}

export {ModelBuilder, AiConfiguration};