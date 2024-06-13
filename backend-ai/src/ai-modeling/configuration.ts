import { Iterations, State, StateTransition } from "./ai-components";
import STATES from "./configuration/states";
import TRANSISITIONS from "./configuration/transitions";
import { AiConfiguration } from "./modelBuilder";
import StateBuilder from "./configuration/stateBuilder";

export default class Configuration {





    private initState(){
        return STATES.START;
    }

    private initValues(){
        return new Map<string, any>();
    }

    private ticker(iterations: Iterations) : Promise<void> {
     
        return new Promise((resolve) => {
            setInterval(() => {
                iterations.runNextIteration();
            }, 1000 )
        });

    }

    configure() : AiConfiguration  {
        let stateBuilder = new StateBuilder();
        let build = stateBuilder.build('sensors-config.json');
       // console.log(build.transitions);
        return {
            states: build.states,
            transitions: build.transitions,
            ticker: this.ticker,
            initState: build.start,
            initValues: this.initValues(),
            enableLog: true
        }
    }

}