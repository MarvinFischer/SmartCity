import { AccumulatorList, AccumulatorStateResponse, AiStateResponse, SensorsInfo, SensorsStatistics } from './apiResponses';

export class BackendApi{
    
    public static getSensors() : Promise<SensorsInfo> {
        return fetch('/api/sensors/info')
        .then(response => response.json());
    }

    public static getSensorStatistics(instanceId: string) : Promise<SensorsStatistics> {        
        return fetch(`/api/sensors/${instanceId}/stats`)
        .then(response => response.json());
    }

    public static getAccumulators() : Promise<AccumulatorList> {
        return fetch('/api/accumulators')
        .then(response => response.json());
    }

    public static getAccumulator(type: string, instanceId: string) : Promise<AccumulatorStateResponse<any, any>> {
        return fetch(`/api/accumulators/${type}/${instanceId}`)
        .then(response => response.json());
    }

    public static setAccumulatorState(type: string, instanceId: string, state: any) : Promise<AccumulatorStateResponse<any, any>> {
        const header = new Headers();
        header.append('Content-Type', 'application/json');
        return fetch(`/api/accumulators/${type}/${instanceId}/state`, {method: 'POST', body: JSON.stringify({state: state}), headers: header}) 
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