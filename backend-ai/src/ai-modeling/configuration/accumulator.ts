import { SensorConfig } from "../../data-analyser/sensor_input_fetcher";
import { State, StateTransition } from "../ai-components";

export default abstract class Accumulator {

    protected states: State<any>[];
    protected transitions: StateTransition[];
    protected name: string;

    constructor(name: string, globalStart: State<any>){
        this.name = name;
        this.states = this.buildStates();
        this.transitions = this.buildTransition(null, globalStart);
    }

    public setNextAccumulator(nextAccumulator: Accumulator|null, globalStart: State<any>){
        this.transitions = this.buildTransition(nextAccumulator, globalStart);
    }

    abstract getType(): string;
    abstract getSubStates(): string[];
    abstract buildTransition(nextAccumulator: Accumulator|null, globalStart: State<any>): StateTransition[];
    abstract buildStates(): State<any>[];
    abstract entry(): string;
    abstract exit(): string;
    public getEntryState(): State<any>{        
        return this.findState(this.entry())!;      
    }
    public getExitState(): State<any>{        
        return this.findState(this.exit())!;      
    }

    protected findState(name: string): State<any> | undefined {
        return this.states.find(state => state.name ===  this.name.toUpperCase() + "_" + name.toUpperCase());
    }

    public getTransitions(){

        return this.transitions;
    }

    protected getAiRules(sensorConfig: SensorConfig) {
        const acc = sensorConfig.aiRules["accumulators"]
        console.log("acc", sensorConfig);
        if(!acc) return null;
        const typedAcc = acc[this.getType()];
        if(!typedAcc) return null;
        return typedAcc[this.name];
    }

}