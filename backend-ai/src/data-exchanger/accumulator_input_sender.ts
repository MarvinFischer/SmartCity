import { RabbitMQConfig } from "./sensor_input_fetcher";

class AccumulatorInputSender {

    private static readonly QUEUE = 'accumulators';

    private channel : any;

    /**
     * Connects to the rabbitmq server
     * @param rabbitConfig the rabbitmq configuration
     * @param sensorConfig the sensor configuration
     */
    public constructor(private rabbitConfig : RabbitMQConfig){

    }

    public connect(){
        const amqp = require('amqplib/callback_api');
        const self : AccumulatorInputSender = this;
        amqp.connect(this.rabbitConfig.ampqString, (error: any, connection: any) => {
            if (error) {
                throw error;
            }          
            connection.createChannel(function(error: any, channel: any) {
                if (error) {
                    throw error;
                }
                channel.assertQueue(AccumulatorInputSender.QUEUE, {
                    durable: false
                });        
                self.channel = channel;                
            });
        });        
    }

    /**
     * sends the data to the rabbitmq server
     * @param data the data to send
     */
    public send(data: AccumulatorExchangeData){
        this.channel.sendToQueue(AccumulatorInputSender.QUEUE, Buffer.from(JSON.stringify(data)));
    }
}

interface AccumulatorExchangeData{
    type: string;
    name: string;
    event: string;
    data: string;
}

export {AccumulatorInputSender, AccumulatorExchangeData};