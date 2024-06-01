import { Iterations, State, StateTransition } from "./ai-components";
import STATES from "./configuration/states";
import TRANSISITIONS from "./configuration/transitions";
import { AiConfiguration } from "./modelBuilder";

export default class Configuration {


    private getStates() {
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

    private getTransitions() {
        return TRANSISITIONS.ALL_TRANSITIONS;
    }

    configure() : AiConfiguration  {
        return {
            states: this.getStates(),
            transitions: this.getTransitions(),
            ticker: this.ticker,
            initState: this.initState()!,
            initValues: this.initValues(),
            enableLog: false
        }
    }

}