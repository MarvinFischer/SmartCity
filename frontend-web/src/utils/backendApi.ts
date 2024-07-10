import { ActuatorList, ActuatorStateResponse, AiStateResponse, SensorsInfo, SensorsStatistics } from './apiResponses';

export class BackendApi{
    
    public static getSensors() : Promise<SensorsInfo> {
        return fetch('/api/sensors/info')
        .then(response => response.json());
    }

    public static getSensorStatistics(instanceId: string) : Promise<SensorsStatistics> {        
        return fetch(`/api/sensors/${instanceId}/stats`)
        .then(response => response.json());
    }

    public static getActuators() : Promise<ActuatorList> {
        return fetch('/api/actuators')
        .then(response => response.json());
    }

    public static getActuator(type: string, instanceId: string) : Promise<ActuatorStateResponse<any, any>> {
        return fetch(`/api/actuators/${type}/${instanceId}`)
        .then(response => response.json());
    }

    public static setActuatorState(type: string, instanceId: string, state: any) : Promise<ActuatorStateResponse<any, any>> {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return fetch(`/api/actuators/${type}/${instanceId}/state`, {method: 'POST', body: JSON.stringify({state: state}), headers: header}) 
        .then(response => response.json());
    }

    public static turnOnAi() : Promise<AiStateResponse> {
        return fetch('/api/ai-states/enable', {method: 'POST'})
        .then(response => response.json());
    }

    public static turnOffAi() : Promise<AiStateResponse> {
        return fetch('/api/ai-states/disable', {method: 'POST'})
        .then(response => response.json());
    }

    public static getAiStatus() : Promise<AiStateResponse> {
        return fetch('/api/ai-states/status')
        .then(response => response.json());
    }

    

}