import { Iterations, State, StateTransition } from "./ai-components";
import STATES from "./configuration/states";
import { AiConfiguration } from "./modelBuilder";
import StateBuilder from "./configuration/stateBuilder";
import ApplicationContext from "../applicationContext";

export default class Configuration {

    private sb = new StateBuilder();
    private aiConfiguration : AiConfiguration;

    constructor(){
        this.aiConfiguration = this.configure();
    }


   

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

    

    private ticker(iterations: Iterations, appContext: ApplicationContext) : Promise<void> {
     
        return new Promise((resolve) => {
            setInterval(() => {
                if(appContext.isEnabled){
                    iterations.runNextIteration();
                }
            }, 1000 )
        });

    }


    private configure() : AiConfiguration  {

        const build = this.sb.build('sensors-config.json');

        return {
            states: build.states,
            transitions: build.transitions,
            accumalators: build.accs,
            ticker: this.ticker,
            initState: this.initState()!,
            initValues: this.initValues(),
            enableLog: false
        }
    }

    get aiConfig(){
        return this.aiConfiguration;
    }

}