import { SensorConfig } from "../../data-exchanger/sensor_input_fetcher";
import { State, StateTransition } from "../ai-components";

export default abstract class Actuator<StateDataType> {

    protected states: State<any>[];
    protected transitions: StateTransition[];
    protected name: string;

    constructor(name: string, globalStart: State<any>){
        this.name = name;
        this.states = this.buildStates();
        this.transitions = this.buildTransition(null, globalStart);
    }

    public setNextActuator(nextActuator: Actuator<any>|null, globalStart: State<any>){
        this.transitions = this.buildTransition(nextActuator, globalStart);
    }

    abstract getStateData(): StateDataType;
    abstract setStateData(data: StateDataType): void;
    abstract getType(): string;
    abstract getName(): string;
    abstract getSubStates(): string[];
    abstract buildTransition(nextActuator: Actuator<any>|null, globalStart: State<any>): StateTransition[];
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
        const acc = sensorConfig.getAiRules(this.getType(), this.name);
        if(!acc) return null;
        const typedAcc = acc[this.getType()];
        if(!typedAcc) return null;
        return typedAcc[this.name];
    }

}