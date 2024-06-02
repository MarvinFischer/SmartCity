import { SensorConfig } from "./data-analyser/sensor_input_fetcher";

export default class ApplicationContext {

    private _sensorConfig: SensorConfig;

    constructor(sensorConfig: SensorConfig){
        this._sensorConfig = sensorConfig;
    }

    get sensorConfig(){
        return this._sensorConfig;
    }   

}