import { json } from "body-parser";
import Sensor from "./sensor";

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
        const jsonData = JSON.parse(data);
        const instanceID = jsonData.instance_id;
        const sensor = this.sensorConfig.getSensor(instanceID);
        if(sensor){
            if(sensor.getTypeId() === 'temperature'){
                sensor.updateValue(jsonData.value[sensor.getUnit()])
            }
       //    
        }
    }

}

interface AccumulatorAiRules{

}


class AiRules {
    private accumators: any;

    getAccumulator(accumulatorType: string, accumulatorId: string): AccumulatorAiRules | null{
        
        if(!this.accumators || !this.accumators[accumulatorType]){
            return null;
        }
        return this.accumators[accumulatorType][accumulatorId];
    }
}

class SensorConfig{

    public readonly sensors: Sensor[];
    public readonly aiRules: any;

    constructor(sensors: Sensor[], aiRules: any = {}){
        this.sensors = sensors;
        this.aiRules = aiRules;
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

        const sensors =  sensorsData.map ((sensor: any) => {          
            return new Sensor(sensor.typeId, sensor.instanceId, sensor.unit);
        });
  

        return new SensorConfig(sensors);
    }

    public getSensor(instanceId: string){ 

        return this.sensors.find(sensor => sensor.getInstanceId() === instanceId);
    }

    public getAiRules(accumulatorType: string, accumulatorId: string){
        return this.aiRules[accumulatorType][accumulatorId];
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
    SensorInputFetcher, SensorConfig, RabbitMQConfig
};