import { StateTransition, State } from "../../ai-components";
import Accumulator from "../accumulator";

export default class WindowAccumulator extends Accumulator{   


    constructor(name: string, globalStart: State<any>){
        super(name, globalStart);
    }

    entry(): string {
        return "CHECK_TEMP";
    }
    exit(): string {
        return "CONTINUE";
    }
    getSubStates(): string[] {
       return ["CHECK_TEMP", "CHECK_HUMIDITY", "CHECK_DATE", "OPENING", "CLOSING", "CONTINUE"];
    }
    buildTransition(nextAccumulator: Accumulator | null, globalStart: State<any> ): StateTransition[] {
               
        const trans :StateTransition[]  = [];

        trans.push(new StateTransition(this.findState("CHECK_TEMP")!, this.findState("CHECK_HUMIDITY")!, new Map<string, any>(), (state: State<any>, iterations: any) => {
            return false;
        }));


        trans.push(new StateTransition(this.findState("CHECK_HUMIDITY")!, this.findState("CHECK_DATE")!, new Map<string, any>(), (state: State<any>, iterations: any) => {
            return false;
        }));

        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("OPENING")!, new Map<string, any>(), (state: State<any>, iterations: any) => {
            return false;
        }));

        
        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("CLOSING")!, new Map<string, any>(), (state: State<any>, iterations: any) => {
            return false;
        }));

        // a transition from all substates to continue      
        this.getSubStates().forEach(subState => {
            const t = new StateTransition(this.findState(subState)!, this.findState("CONTINUE")!, new Map<string, any>(), (state: State<any>, iterations: any) => {
                return state.name === globalStart.name;
            })
            trans.push(t);
         });


        // end to next state
        if(nextAccumulator){          
            const nextStart = nextAccumulator.getEntryState();
            if(nextStart){
                const end = this.findState("CONTINUE")!;
                const t = new StateTransition(end, nextStart, new Map<string, any>(), (state: State<any>, iterations: any) => {
                    return state.name === globalStart.name; });
                trans.push(t);
            }
        }else{
            const end = this.findState("CONTINUE")!;
            const t = new StateTransition(end, globalStart, new Map<string, any>(), (state: State<any>, iterations: any) => {
                return state.name === globalStart.name; });
            trans.push(t);
        }      
        this.transitions = trans;
        return trans;
    }
    buildStates(): State<any>[] {
        const states = this.getSubStates().map(subState => {
            return new State(this.name.toUpperCase() + "_" + subState.toUpperCase(), subState);
        });
        return states;
    }


}