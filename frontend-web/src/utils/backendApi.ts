import { SensorsInfo, SensorsStatistics } from './apiResponses';

export class BackendApi{
    
    public static getSensors() : Promise<SensorsInfo> {
        return fetch('/api/sensors/info')
        .then(response => response.json());
    }

    public static getSensorStatistics(instanceId: string) : Promise<SensorsStatistics> {        
        return fetch(`/api/sensors/${instanceId}/stats`)
        .then(response => response.json());
    }


}