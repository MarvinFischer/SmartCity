import { Express} from 'express';
import {VisualisationRoutes} from './visualisation';
import ApplicationContext from '../applicationContext';



export function registerRoutes(app: Express, appContext: ApplicationContext): void {

  
    const visualisationRoutes = new VisualisationRoutes(appContext);

    app.get('/sensors/info', visualisationRoutes.allSensors.bind(visualisationRoutes));
    app.get('/sensors/:instanceId/stats', visualisationRoutes.getSensorStatistics.bind(visualisationRoutes));
}


