import { Request, Response } from 'express';
import ApplicationContext from '../applicationContext';
import { ActuatorAiContextRules } from '../data-exchanger/sensor_input_fetcher';


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

    public getActuators(req: Request, res: Response) {
        const accs  = this.appContext.sensorConfig.getAllActuatorsIds();
        if(!accs){
            res.status(404).send("Actuators not found");
            return;
        }
        res.send({actuators: accs});
    }

    public getActuator(req: Request, res: Response) {
        const type = req.params.type;
        const instanceId = req.params.instanceId;

        const accs = this.appContext.configuration.aiConfig.accumalators;

        const accMeta =  this.appContext.sensorConfig.getAiRules(type, instanceId);

        if(!accMeta){
            res.status(404).send("Actuator not found");
            return;
        }

        const accState = accs.find(acc => acc.getType() === type && acc.getName() === instanceId);
        const state = accState != null ? accState.getStateData() : {};

        res.send({meta: accMeta, state: state});
    }

    public setActuatorState(req: Request, res: Response) {
        const type = req.params.type;
        const instanceId = req.params.instanceId;
        const state = req.body.state;

        const accs = this.appContext.configuration.aiConfig.accumalators;
        const accState = accs.find(acc => acc.getType() === type && acc.getName() === instanceId);

        if(!accState){
            res.status(404).send("Actuator not found");
            return;
        }

        accState.setStateData(state);
        res.send({state: "ok"});
    }

    public enableAi(req: Request, res: Response) {
        this.appContext.enable();
        res.send({
            state: "enabled",
            iterationState: this.appContext.iterationState
        });
    }

    public disableAi(req: Request, res: Response) {
        this.appContext.disable();
        res.send({
            state: "disabled",
            iterationState: this.appContext.iterationState
        });
    }

    public getAiStatus(req: Request, res: Response) {
        res.send({
            state: this.appContext.isEnabled ? "enabled" : "disabled",
            iterationState: this.appContext.iterationState
        });
    }

   
}