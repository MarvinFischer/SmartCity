import { ActuatorInputSender } from "../../../data-exchanger/actuator_input_sender";
import { SensorConfig } from "../../../data-exchanger/sensor_input_fetcher";
import { StateTransition, State, Iterations, VarHistory } from "../../ai-components";
import Actuator from "../actuator";
import FanConfig from "../configs/fanConfig";


export interface FanStateData {
    turnedOn: boolean;
}

export default class FanActuator extends Actuator<FanStateData>{

    private turnedOn = false;

    getStateData(): FanStateData {
        return {turnedOn: this.turnedOn};
    }   

    getName(): string {
        return this.name;
    }

    setStateData(data: FanStateData): void {
        this.turnedOn = data.turnedOn;
    }

    constructor(name: string, globalStart: State<any>){
        super(name, globalStart);
    }

    getType(): string {
        return "fans";
    }
    entry(): string {
        return "CHECK_TEMP";
    }
    exit(): string {
        return "CONTINUE";
    }
    getSubStates(): string[] {
       return ["CHECK_TEMP", "CHECK_HUMIDITY", "CHECK_DATE", "TURNING_ON", "TURNING_OFF", "CONTINUE"];
    }
    buildTransition(nextActuator: Actuator<any> | null, globalStart: State<any> ): StateTransition[] {
               
        const trans :StateTransition[]  = [];

        // turning off operation at each state
        trans.push(new StateTransition(this.findState("CHECK_TEMP")!, this.findState("TURNING_OFF")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {

            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as FanConfig;
            
            const stateVarName = aiConfigRules.turnOn.vars.stateVar;
            const isTurnedOn = this.isTurnedOn(varHisotry, stateVarName);


            if(isTurnedOn){
                // handle turn off logic
                const maxTemp = aiConfigRules.turnOff.maxTemp.value;
                const tempSensor = aiConfigRules.turnOff.maxTemp.sensors;
                const allSensorsMatchTemp = tempSensor.every(sensor => {
                    const currentAvgTemp = sensorConfig.getSensor(sensor)!.getStatistics().avg[0];
                    return currentAvgTemp < maxTemp;
                });

                if(allSensorsMatchTemp){
                    this.turnedOn = false;
                }  
                return allSensorsMatchTemp;
            }   
            return false;

        }));

        trans.push(new StateTransition(this.findState("CHECK_HUMIDITY")!, this.findState("TURNING_OFF")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {

            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as FanConfig;
            
            const stateVarName = aiConfigRules.turnOn.vars.stateVar;
            const isTurnedOn = this.isTurnedOn(varHisotry, stateVarName);

            if(isTurnedOn){
                // handle turn off logic
                const maxHumidity = aiConfigRules.turnOff.maxHumidity.value;
                const humSensors = aiConfigRules.turnOff.maxHumidity.sensors;
                const allSensorsMatchTemp = humSensors.every(sensor => {
                    const currentAvgHum = sensorConfig.getSensor(sensor)!.getStatistics().avg[0];
                    return currentAvgHum < maxHumidity;
                });

                if(allSensorsMatchTemp){
                    this.turnedOn = false;
                }                
                return allSensorsMatchTemp;
            }

            return false;

        }));

        trans.push(new StateTransition(this.findState("CHECK_TEMP")!, this.findState("CHECK_HUMIDITY")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {
            

            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as FanConfig;
            
            const stateVarName = aiConfigRules.turnOn.vars.stateVar;
            const isTurnedOn = this.isTurnedOn(varHisotry, stateVarName);


            if(isTurnedOn){
                // handle turn off logic
                const maxTemp = aiConfigRules.turnOff.maxTemp.value;
                const tempSensor = aiConfigRules.turnOff.maxTemp.sensors;
                const allSensorsMatchTemp = tempSensor.every(sensor => {
                    const currentAvgTemp = sensorConfig.getSensor(sensor)!.getStatistics().avg[0];
                    return currentAvgTemp < maxTemp;
                });

                return allSensorsMatchTemp;
            }else {
                // handle turn on logic
                const minTemp = aiConfigRules.turnOn.minTemp.value;
                const tempSensor = aiConfigRules.turnOn.minTemp.sensors;
                const allSensorsMatchTemp = tempSensor.every(sensor => {
                    const currentAvgTemp = sensorConfig.getSensor(sensor)!.getStatistics().avg[0];
                    return currentAvgTemp > minTemp;
                });

                return allSensorsMatchTemp;
            }
        }));


        trans.push(new StateTransition(this.findState("CHECK_HUMIDITY")!, this.findState("CHECK_DATE")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {
            
            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as FanConfig;
            
            const stateVarName = aiConfigRules.turnOn.vars.stateVar;
            const isTurnedOn = this.isTurnedOn(varHisotry, stateVarName);

            if(isTurnedOn){
                // handle turn off logic
                const maxHumidity = aiConfigRules.turnOff.maxHumidity.value;
                const humSensors = aiConfigRules.turnOff.maxHumidity.sensors;
                const allSensorsMatchTemp = humSensors.every(sensor => {
                    const currentAvgHum = sensorConfig.getSensor(sensor)!.getStatistics().avg[0];
                    return currentAvgHum < maxHumidity;
                });

                return allSensorsMatchTemp;
            }else{
                // handle turn on logic
                const minHumidity = aiConfigRules.turnOn.minHumidity.value;
                const humSensors = aiConfigRules.turnOn.minHumidity.sensors;
                const allSensorsMatchTemp = humSensors.every(sensor => {
                    const currentAvgHum = sensorConfig.getSensor(sensor)!.getStatistics().avg[0];
                    return currentAvgHum > minHumidity;
                });

                return allSensorsMatchTemp;
            }
        }));

        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("TURNING_ON")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {
            
            // as current week day as full string
            const currentWeekDay = new Date().getDay();
            const dayString = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentWeekDay].toUpperCase();
            const aiConfigRules = sensorConfig.getAiRules(this.getType(), this.name) as FanConfig;
            const days = aiConfigRules.turnOn.onlyOnDays.map(day => day.toUpperCase());
            const open =  days.includes(dayString);
            if(!open) return false;
            this.turnedOn = true;           
            actuatorInputSender.send({name: this.name, type: this.getType(), event: "TURNING_ON", data: ""});
            varHisotry.addVersion(aiConfigRules.turnOn.vars.stateVar, true);
            return true;
        }));

        
        trans.push(new StateTransition(this.findState("CHECK_DATE")!, this.findState("TURNING_OFF")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {
            // windows can be closed every day
            if(!this.turnedOn) return false;
            actuatorInputSender.send({name: this.name, type: this.getType(), event: "TURNING_OFF", data: ""});
            this.turnedOn = false;
            return true;
        }));


        // end to next state
        if(nextActuator != null){          
            const nextStart = nextActuator.getEntryState();

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
            const t = new StateTransition(this.findState(subState)!, this.findState("CONTINUE")!, new Map<string, any>(), (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, actuatorInputSender: ActuatorInputSender) => {
                return true;
            })
            trans.push(t);
         });

        this.transitions = trans;

        return trans;
    }
    private isTurnedOn(varHisotry: VarHistory, stateVarName: string) {
        // check if the fan is already turned on by checking the current state and the ai history
        const isOn = this.turnedOn || varHisotry.getLatestValue(stateVarName, false);
        return isOn;
    }

    buildStates(): State<any>[] {
        const states = this.getSubStates().map(subState => {
            return new State(this.name.toUpperCase() + "_" + subState.toUpperCase(), subState);
        });
        return states;
    }


}