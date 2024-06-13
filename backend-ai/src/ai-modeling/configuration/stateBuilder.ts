import { State, StateTransition } from "../ai-components";
import Accumulator from "./accumulator";
import WindowAccumulator from "./accumulators/windowAccumulator";

export default class StateBuilder {
    constructor() {
    }
    public build(sensorConfigPath : string){
        // read the sensor config
        const fs = require('fs');
        const data = fs.readFileSync(sensorConfigPath, 'utf8');
        const jsonData = JSON.parse(data);
        
        // read ai rules and get accumulators    
       
        const globalStart = new State("START", "START");
        const globalEnd = new State("END", "END");
        const accs = this.getAccumulator(jsonData, globalStart);
        const buildStates = this.buildStates(accs);
        const trans = this.buildTransitons(accs, globalStart, buildStates);
        // add global start and end states
        buildStates.push(globalStart);
        buildStates.push(globalEnd);
        return {
            start: globalStart,
            end: globalEnd,
            states: buildStates,
            transitions: trans
        };

    }

    private buildTransitons(accs: Accumulator[], globalStart: State<any>, states: State<any>[]) {
        const transitions = [];
        // set start state to first accumulator transition

        let startT = new StateTransition(globalStart, accs[0].getEntryState(), new Map<string, any>(), (state: State<any>, varHisotry: Map<string, any>, sensorConfig: any) => {
            return true; // always true
        });

        transitions.push(startT);
        for (let i = 0; i < accs.length; i++){
            const acc = accs[i];
            const nextAcc = i < accs.length - 1 ? accs[i+1] : null;
            acc.setNextAccumulator(nextAcc, globalStart);
            transitions.push(acc.getTransitions());
        }
        return transitions.flat();
    }



    private buildStates(accs: Accumulator[]){
        return accs.map(acc => {
            return acc.buildStates();
        }).flatMap(states => states);

        

    }

    private getAccumulator(jsonData: any, globalStart: State<any>) : Accumulator[]{
        const aiRules = jsonData.aiRules;
        const accumulators = aiRules.accumulators;
        const types = Object.keys(accumulators);
        const accs : Accumulator[] = [];
        types.forEach(type => {
            const acc = accumulators[type];
            const names = Object.keys(acc);            
            names.forEach(name => {
                const accData = acc[name];           
                if (type === "windows"){
                    const accu = new WindowAccumulator(name, globalStart);
                    accs.push(accu);
                }                
            });           
        });
       
        return accs;
    }
}