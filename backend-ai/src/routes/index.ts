import { Express} from 'express';
import {VisualisationRoutes} from './visualisation';
import ApplicationContext from '../applicationContext';



export function registerRoutes(app: Express, appContext: ApplicationContext): void {

  
    const visualisationRoutes = new VisualisationRoutes(appContext);

    app.get('/sensors/info', visualisationRoutes.allSensors.bind(visualisationRoutes));
    app.get('/sensors/:instanceId/stats', visualisationRoutes.getSensorStatistics.bind(visualisationRoutes));
    app.get('/ai-states/current', visualisationRoutes.getCurrentState.bind(visualisationRoutes));
    app.get('/actuators', visualisationRoutes.getActuators.bind(visualisationRoutes));
    app.get('/actuators/:type/:instanceId', visualisationRoutes.getActuator.bind(visualisationRoutes));
    app.post('/actuators/:type/:instanceId/state', visualisationRoutes.setActuatorState.bind(visualisationRoutes));
    app.post('/ai-states/enable', visualisationRoutes.enableAi.bind(visualisationRoutes));
    app.post('/ai-states/disable', visualisationRoutes.disableAi.bind(visualisationRoutes));
    app.get('/ai-states/status', visualisationRoutes.getAiStatus.bind(visualisationRoutes));
}


