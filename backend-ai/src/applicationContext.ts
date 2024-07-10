import Configuration from "./ai-modeling/configuration";
import { SensorConfig } from "./data-exchanger/sensor_input_fetcher";

export default class ApplicationContext {

    private _sensorConfig: SensorConfig;
    private _configuration: Configuration;
    private _isEnabled: boolean = true;
    public iterationState = "";

    constructor(sensorConfig: SensorConfig, configuration: Configuration){
        this._sensorConfig = sensorConfig;
        this._configuration = configuration;
    }

    public enable(){
        this._isEnabled = true;
    }

    public disable(){
        this._isEnabled = false;
    }


    get sensorConfig(){
        return this._sensorConfig;
    }   

    get isEnabled(){
        return this._isEnabled;
    }

    get configuration(){
        return this._configuration;
    }

}