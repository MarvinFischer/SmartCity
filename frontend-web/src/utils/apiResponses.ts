export interface SensorInfo {

    instanceId: string;
    typeId: string;
    units: string[];
    labels: string[];
}

export interface SensorsStatistics {
    min: number[];
    max: number[];
    avg: number[];
    median: number[];
    q1: number[];
    q3: number[];
}

export class SensorsInfo extends Array<SensorInfo> {

}