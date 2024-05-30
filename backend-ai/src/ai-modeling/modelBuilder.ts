import { Iterations, Model, State, StateTransition } from "./ai-components";

class ModelBuilder {
    buildModel(conf: AiConfiguration) {
        return new Model(conf.states, conf.transitions);
    }

    runModel(conf: AiConfiguration){
        // build the model based on the configuration
        let model = this.buildModel(conf);

        let enableLog = conf.enableLog;
   

        let opts = {
            enableLog: enableLog
        }

        // setup the model instance
        let iterations = new Iterations(model, conf.initValues, conf.initState, opts);

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
}

export {ModelBuilder, AiConfiguration};