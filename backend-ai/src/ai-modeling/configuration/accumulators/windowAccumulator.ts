import { SensorConfig } from "../../../data-analyser/sensor_input_fetcher";
import { StateTransition, State, Iterations, VarHistory } from "../../ai-components";
import Accumulator from "../accumulator";

export default class WindowAccumulator extends Accumulator{   


    constructor(name: string, globalStart: State<any>){
        super(name, globalStart);
    }

    getType(): string {
        return "window";
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

        trans.push(new StateTransition(this.findState("CHECK_TEMP")!, this.findState("CHECK_HUMIDITY")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig) => {
            const aiRules = this.getAiRules(sensorConfig);
            const minTemp = 20;
            const currentTemp = sensorConfig.getSensor("indoor_temperature_0")!.getStatistics().avg;
            console.log("aiRules", aiRules);
          //  console.log("aiRules", {minTemp, currentTemp});
            return false;
        }));


        trans.push(new StateTransition(this.findState("CHECK_HUMIDITY")!, this.findState("CHECK_DATE")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig) => {
            return false;
        }));

        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("OPENING")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig) => {
            return false;
        }));

        
        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("CLOSING")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig) => {
            
            
            return false;
        }));


        // end to next state
        if(nextAccumulator != null){          
            const nextStart = nextAccumulator.getEntryState();

            if(nextStart){
                const end = this.findState("CONTINUE")!;
                const t = new StateTransition(end, nextStart, new Map<string, any>(), (state: State<any>, iterations: any) => {
                    
                    return true;
                });
                trans.push(t);
            }
        }else{
            const end = this.findState("CONTINUE")!;
            const t = new StateTransition(end, globalStart, new Map<string, any>(), (state: State<any>, iterations: any) => {
                return true});
            trans.push(t);
        }      


        // a transition from all substates to continue , alawys true to catch and continue    
        this.getSubStates().forEach(subState => {
            const t = new StateTransition(this.findState(subState)!, this.findState("CONTINUE")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig) => {
                return true;
            })
            trans.push(t);
         });

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