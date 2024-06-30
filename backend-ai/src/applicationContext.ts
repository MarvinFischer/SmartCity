import Configuration from "./ai-modeling/configuration";
import { SensorConfig } from "./data-exchanger/sensor_input_fetcher";

export default class ApplicationContext {

    private _sensorConfig: SensorConfig;
    private _configuration: Configuration;

    constructor(sensorConfig: SensorConfig, configuration: Configuration){
        this._sensorConfig = sensorConfig;
        this._configuration = configuration;
    }

    get sensorConfig(){
        return this._sensorConfig;
    }   

    get configuration(){
        return this._configuration;
    }

}