import { Request, Response } from 'express';
import ApplicationContext from '../applicationContext';
import { AccumulatorAiContextRules } from '../data-exchanger/sensor_input_fetcher';


export class VisualisationRoutes {

    private appContext: ApplicationContext;

    constructor(appContext: ApplicationContext){
        this.appContext = appContext;
    }

    public allSensors(req: Request, res: Response) {

        const data = this.appContext.sensorConfig.sensors.map(sensor => {
            return {
                "instanceId": sensor.getInstanceId(),
                "typeId": sensor.getTypeId(),
                "units": sensor.getUnit(),
                "labels": sensor.getLabels(),
            }
        });
    res.send(data);
    }

    public getSensorStatistics(req: Request, res: Response) {
        const instanceId = req.params.instanceId;        
        const sensor = this.appContext.sensorConfig.getSensor(instanceId);
        if(!sensor){
            res.status(404).send("Sensor not found");
            return;
        }
        res.send(sensor.getStatistics());
        
    }

    public getCurrentState(req: Request, res: Response) {

        const accs = this.appContext.configuration.aiConfig.accumalators;
        const data = accs.map(acc => {
            return {
                "type": acc.getType(),
                "name": acc.getName(),
                "state": acc.getStateData()
            }
        });

        res.send(data);
    }

    public getAccumulators(req: Request, res: Response) {
        const accs  = this.appContext.sensorConfig.getAllAccumulatorsIds();
        if(!accs){
            res.status(404).send("Accumulators not found");
            return;
        }
        res.send({accumulators: accs});
    }

    public getAccumulator(req: Request, res: Response) {
        const type = req.params.type;
        const instanceId = req.params.instanceId;

        const accs = this.appContext.configuration.aiConfig.accumalators;

        const accMeta =  this.appContext.sensorConfig.getAiRules(type, instanceId);

        if(!accMeta){
            res.status(404).send("Accumulator not found");
            return;
        }

        const accState = accs.find(acc => acc.getType() === type && acc.getName() === instanceId);
        const state = accState != null ? accState.getStateData() : {};

        res.send({meta: accMeta, state: state});
    }

   
}