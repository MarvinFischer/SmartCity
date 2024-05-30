import { Iterations, State, StateTransition } from "./ai-components";
import { AiConfiguration } from "./modelBuilder";

export default class Configuration {


    private getStates() {
        return [
            new State("start", "start"),
            new State("checkDate", "checkDate"),
            new State("open_window_1", "opening_window"),
            new State("open_window_2", "opening_window")
        ]
    }

    private findState(name: string){
        return this.getStates().find(state => state.name === name);
    }

    private initState(){
        return this.findState("start");
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
        return [
            new StateTransition(this.findState("start")!, this.findState("checkDate")!, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
                return true;
            }
            ),
            new StateTransition(this.findState("checkDate")!, this.findState("open_window_1")!, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
                return true;
            }),
            new StateTransition(this.findState("open_window_1")!, this.findState("open_window_2")!, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
                return true;
            }),
            // back to start
            new StateTransition(this.findState("open_window_2")!, this.findState("start")!, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
                return true;
            })
        ]
    }

    configure() : AiConfiguration  {
        return {
            states: this.getStates(),
            transitions: this.getTransitions(),
            ticker: this.ticker,
            initState: this.initState()!,
            initValues: this.initValues(),
            enableLog: true
        }
    }

}