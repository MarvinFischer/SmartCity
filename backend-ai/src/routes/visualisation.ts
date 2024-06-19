import { Request, Response } from 'express';
import ApplicationContext from '../applicationContext';


export class VisualisationRoutes {

    private appContext: ApplicationContext;

    constructor(appContext: ApplicationContext){
        console.log(appContext);
        this.appContext = appContext;
    }

    public allSensors(req: Request, res: Response) {

        const data = this.appContext.sensorConfig.sensors.map(sensor => {
            return {
                "instanceId": sensor.getInstanceId(),
                "typeId": sensor.getTypeId(),
                "unit": sensor.getUnit()
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
}