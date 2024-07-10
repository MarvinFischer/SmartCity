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


export interface ActuatorListItem {
    type: string;
    id: string;
}

export interface ActuatorList {
    actuators: ActuatorListItem[];
}

export interface WindowMeta{
    open: {
        minTemp: {
            value: number;
            sensors: string[];
        };
        minHumidity: {
            value: number;
            sensors: string[];
        };
        checkOutsideTemp: {
            value: boolean;
            delta: number;
            sensors: string[];
        },
        onlyOnDays: string[];
        vars: {
            stateVar: string;
        }
    },
    close: {
        maxTemp: {
            value: number;
            sensors: string[];
        }
        maxHumidity: {
            value: number;
            sensors: string[];
        },
        checkOutsideTemp: {
            value: boolean;
            delta: number;
            sensors: string[];
        },
        vars: {
            stateVar: string;
        }
    }

}

export interface FanMeta {
    turnOn: {
        minTemp: {
            value: number;
            sensors: string[];
        };
        minHumidity: {
            value: number;
            sensors: string[];
        };
        onlyOnDays: string[];
        vars: {
            stateVar: string;
        }
    },
    turnOff: {
        maxTemp: {
            value: number;
            sensors: string[];
        }
        maxHumidity: {
            value: number;
            sensors: string[];
        }
        vars: {
            stateVar: string;
        }
    }
}

export interface WindowState {
    open: boolean;
}

export interface FanState {
    turnedOn: boolean;
}

export interface ActuatorStateResponse<MetaType, StateType> {
    meta: MetaType;
    state: StateType;
}

export interface AiStateResponse {
    state: 'enabled' | 'disabled';
    iterationState: string;
}