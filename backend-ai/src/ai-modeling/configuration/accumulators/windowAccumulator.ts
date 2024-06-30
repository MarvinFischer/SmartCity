import { AccumulatorInputSender } from "../../../data-exchanger/accumulator_input_sender";
import { SensorConfig } from "../../../data-exchanger/sensor_input_fetcher";
import { StateTransition, State, Iterations, VarHistory } from "../../ai-components";
import Accumulator from "../accumulator";
import WindowConfig from "../configs/windowsConfig";

export default class WindowAccumulator extends Accumulator{

    private open = false;

    getStateData() {
        return {open: this.open};
    }   

    getName(): string {
        return this.name;
    }

    constructor(name: string, globalStart: State<any>){
        super(name, globalStart);
    }

    getType(): string {
        return "windows";
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

        trans.push(new StateTransition(this.findState("CHECK_TEMP")!, this.findState("CHECK_HUMIDITY")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) => {
            

            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as WindowConfig;
            
            const stateVarName = aiConfigRules.open.vars.stateVar;
            const isOpen = this.isWindowOpen(varHisotry, stateVarName);

            if(isOpen){
                // handle closing logic
                const maxTemp = aiConfigRules.close.maxTemp.value;
                const tempSensor = aiConfigRules.close.maxTemp.sensors;
                const allSensorsMatchTemp = tempSensor.every(sensor => {
                    const currentAvgTemp = sensorConfig.getSensor(sensor)!.getStatistics().avg;
                    return currentAvgTemp < maxTemp;
                });

                return allSensorsMatchTemp;
            }else{
                // handle opening logic
                const minTemp = aiConfigRules.open.minTemp.value;
                const tempSensor = aiConfigRules.open.minTemp.sensors;
                const allSensorsMatchTemp = tempSensor.every(sensor => {
                    const currentAvgTemp = sensorConfig.getSensor(sensor)!.getStatistics().avg;
                    return currentAvgTemp > minTemp;
                });

                return allSensorsMatchTemp;
            }
        }));


        trans.push(new StateTransition(this.findState("CHECK_HUMIDITY")!, this.findState("CHECK_DATE")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) => {
            
            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as WindowConfig;
            
            const stateVarName = aiConfigRules.open.vars.stateVar;
            const isOpen = this.isWindowOpen(varHisotry, stateVarName);

            if(isOpen){
                // handle closing logic
                const maxHumidity = aiConfigRules.close.maxHumidity.value;
                const humSensors = aiConfigRules.close.maxHumidity.sensors;
                const allSensorsMatchTemp = humSensors.every(sensor => {
                    const currentAvgHum = sensorConfig.getSensor(sensor)!.getStatistics().avg;
                    return currentAvgHum < maxHumidity;
                });
    
                return allSensorsMatchTemp;
            }else{
                // handle opening logic
                const minHumidity = aiConfigRules.open.minHumidity.value;
                const humSensors = aiConfigRules.open.minHumidity.sensors;
                const allSensorsMatchTemp = humSensors.every(sensor => {
                    const currentAvgHum = sensorConfig.getSensor(sensor)!.getStatistics().avg;
                    return currentAvgHum > minHumidity;
                });
    
                return allSensorsMatchTemp;
            }
            
         
        }));

        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("OPENING")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) => {
            
            // as current week day as full string
            const currentWeekDay = new Date().getDay();
            const dayString = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentWeekDay].toUpperCase();
            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as WindowConfig;
            const days = aiConfigRules.open.onlyOnDays.map(day => day.toUpperCase());
            const open =  days.includes(dayString);
            if(!open) return false;
            this.open = true;           
            accumulatorInputSender.send({name: this.name, type: this.getType(), event: "OPEN", data: ""});
            varHisotry.addVersion(aiConfigRules.open.vars.stateVar, true);
            return true;
        }));

        
        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("CLOSING")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) => {
            // windows can be closed every day
            accumulatorInputSender.send({name: this.name, type: this.getType(), event: "CLOSE", data: ""});
            this.open = false;
            return true;
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
            const t = new StateTransition(this.findState(subState)!, this.findState("CONTINUE")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) => {
                return true;
            })
            trans.push(t);
         });

        this.transitions = trans;

        return trans;
    }
    private isWindowOpen(varHisotry: VarHistory, stateVarName: string) {
        const isOpenVarHisory = varHisotry.get(stateVarName) || [];
        const isOpen = isOpenVarHisory.length > 0 ? isOpenVarHisory[isOpenVarHisory.length - 1] : false;
        return isOpen;
    }

    buildStates(): State<any>[] {
        const states = this.getSubStates().map(subState => {
            return new State(this.name.toUpperCase() + "_" + subState.toUpperCase(), subState);
        });
        return states;
    }


}