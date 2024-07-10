import { ActuatorInputSender } from "../../data-exchanger/actuator_input_sender";
import { SensorConfig } from "../../data-exchanger/sensor_input_fetcher";
import { State, StateTransition, VarHistory } from "../ai-components";
import Actuator from "./actuator";
import FanActuator from "./actuators/fanActuator";
import WindowActuator from "./actuators/windowActuator";

export default class StateBuilder {
    constructor() {
    }
    public build(sensorConfigPath : string){
        // read the sensor config
        const fs = require('fs');
        const data = fs.readFileSync(sensorConfigPath, 'utf8');
        const jsonData = JSON.parse(data);
        
        // read ai rules and get Actuators    
       
        const globalStart = new State("START", "START");
        const globalEnd = new State("END", "END");
        const accs = this.getActuator(jsonData, globalStart);
        const buildStates = this.buildStates(accs);
        const trans = this.buildTransitons(accs, globalStart, buildStates);
        // add global start and end states
        buildStates.push(globalStart);
        buildStates.push(globalEnd); 
        return {
            start: globalStart,
            end: globalEnd,
            states: buildStates,
            transitions: trans,
            accs: accs
        };

    }

    private buildTransitons(accs: Actuator<any>[], globalStart: State<any>, states: State<any>[]) {
        const transitions = [];
        // set start state to first Actuator transition

        let startT = new StateTransition(globalStart, accs[0].getEntryState(), new Map<string, any>(), (start: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {
            return true; // always true
        });

        transitions.push(startT);
        for (let i = 0; i < accs.length; i++){
            const acc = accs[i];
            const nextAcc = i < accs.length - 1 ? accs[i+1] : null;
            acc.setNextActuator(nextAcc, globalStart);
            transitions.push(acc.getTransitions());
        }
        return transitions.flat();
    }



    private buildStates(accs: Actuator<any>[]){
        return accs.map(acc => {
            return acc.buildStates();
        }).flatMap(states => states);

        

    }

    private getActuator(jsonData: any, globalStart: State<any>) : Actuator<any>[]{
        const aiRules = jsonData.aiRules;
        const actuators = aiRules.actuators;
        const types = Object.keys(actuators);
        const accs : Actuator<any>[] = [];
        types.forEach(type => {
            const acc = actuators[type];
            const names = Object.keys(acc);            
            names.forEach(name => {
                const accData = acc[name];           
                if (type === "windows"){
                    const accu = new WindowActuator(name, globalStart);
                    accs.push(accu);
                }else if(type === "fans"){
                    const accu = new FanActuator(name, globalStart);
                    accs.push(accu);
                }                
            });           
        });
       
        return accs;
    }
}