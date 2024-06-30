import { json } from "body-parser";
import Sensor from "./sensor";
import Accumulator from "../ai-modeling/configuration/accumulator";

class SensorInputFetcher{

    private static readonly QUEUE = 'sensors';

    /**
     * Starts the sensor input fetcher
     * @param rabbitConfig the rabbitmq configuration
     * @param sensorConfig the sensor configuration
     */
    public constructor(private rabbitConfig : RabbitMQConfig, private sensorConfig : SensorConfig){

    }

    public start(){
        const amqp = require('amqplib/callback_api');
        let self : SensorInputFetcher = this;
        amqp.connect(this.rabbitConfig.ampqString, (error: any, connection: any) => {
            if (error) {
                throw error;
            }          
            connection.createChannel(function(error: any, channel: any) {
                if (error) {
                    throw error;
                }
                channel.assertQueue(SensorInputFetcher.QUEUE, {
                    durable: false
                });         
                
                channel.consume(SensorInputFetcher.QUEUE, function(msg: any) {
                    self.handleSensorInput(msg.content.toString());
                }, {
                    noAck: true
                });
            });
        });
    }

    private handleSensorInput(data: string){
        const supportedSingleTypes = ['temperature', 'humidity'];
        const weatherType = "temperature_humidity";
        const jsonData = JSON.parse(data);
        const instanceID = jsonData.instance_id;
        const sensor = this.sensorConfig.getSensor(instanceID);       
        if(sensor){
            if(supportedSingleTypes.findIndex(type => type === sensor.getTypeId()) !== -1){
                sensor.updateValue(jsonData.value[sensor.getUnit()[0]])
            }else if(sensor.getTypeId() === weatherType){                
                const temperature = jsonData.value[sensor.getUnit()[0]];
                const humidity = jsonData.value[sensor.getUnit()[1]];     
                sensor.updateValue([temperature, humidity]);     
            }
        }
    }

}

interface AccumulatorAiContextRules{
    [key: string]: any;
}

interface AccumulatorAiRules{
    accumulators: {
        [key: string]: AccumulatorAiContextRules;
    }
}


class AiRules {
    private accumalators: {[key: string]: AccumulatorAiContextRules};
    public constructor(accumalators : AccumulatorAiRules = {accumulators: {} }){
        this.accumalators = accumalators.accumulators;
    }

    getAccumulator(accumulatorType: string, accumulatorId: string): AccumulatorAiContextRules | null{      
        if(!this.accumalators || !this.accumalators[accumulatorType]){
            return null;
        }
        return this.accumalators[accumulatorType][accumulatorId];
    }

    getAllTypes(){
        return Object.keys(this.accumalators);
    }

    getTypeIds(type: string){
        return Object.keys(this.accumalators[type]);
    }
}

class SensorConfig{

    public readonly sensors: Sensor[];
    public readonly aiRules: AiRules;

    constructor(sensors: Sensor[], aiRules: AiRules|null = null){
        this.sensors = sensors;
        this.aiRules = aiRules ?? new AiRules();
    }

    /**
     * Creates a SensorConfig object from a file
     * @param filePath the file path
     * @returns 
     */
    public static fromFile(filePath: string){

        const fs = require('fs');
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        const sensorsData = jsonData.sensors;
        const aiRulesData = jsonData.aiRules;

        const sensors =  sensorsData.map ((sensor: any) => {          
            return new Sensor(sensor.typeId, sensor.instanceId, sensor.unit, sensor.label);
        });

        let aiRules =new AiRules(aiRulesData);       
  

        return new SensorConfig(sensors, aiRules);
    }

    public getSensor(instanceId: string){ 
        return this.sensors.find(sensor => sensor.getInstanceId() === instanceId);
    }

    public getAiRules(accumulatorType: string, accumulatorId: string){
        return this.aiRules.getAccumulator(accumulatorType,accumulatorId);
    }

    public getAllAccumulatorsIds() : {id: string, type: string}[]{
        let types =  this.aiRules.getAllTypes();

        let ids: { id: string; type: string; }[] = [];

        types.forEach(type => {
            this.aiRules.getTypeIds(type).forEach(id => {
                ids.push({id: id, type: type});
            });
        });

        return ids;
    }

}

class RabbitMQConfig{

    public readonly ampqString: string;

    /**
     * 
     * @param rabbitMqUser the rabbitmq user
     * @param rabbitMQPass the rabbitmq password
     * @param rabbitmqHost the rabbitmq host
     * @param rabbitmqPort the rabbitmq port
     */
    constructor(rabbitMqUser: string, rabbitMQPass: string, rabbitmqHost : string, rabbitmqPort : string){
        this.ampqString = `amqp://${rabbitMqUser}:${rabbitMQPass}@${rabbitmqHost}:${rabbitmqPort}`;
    }
    
}

export {
    SensorInputFetcher, SensorConfig, RabbitMQConfig, AccumulatorAiContextRules
};