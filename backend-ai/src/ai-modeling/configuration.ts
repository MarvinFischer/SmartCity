import { Iterations, State, StateTransition } from "./ai-components";
import STATES from "./configuration/states";
import { AiConfiguration } from "./modelBuilder";
import StateBuilder from "./configuration/stateBuilder";

export default class Configuration {

    private sb = new StateBuilder();

   

    private getStates() {
      
        this.sb.build('sensors-config.json');

        return STATES.ALL_STATES;
    }

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

        const build = this.sb.build('sensors-config.json');

        return {
            states: build.states,
            transitions: build.transitions,
            ticker: this.ticker,
            initState: this.initState()!,
            initValues: this.initValues(),
            enableLog: false
        }
    }

}