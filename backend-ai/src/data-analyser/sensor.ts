export default class Sensor {

    private typeId: string;
    private instanceId: string;
    private unit: string;
    private currentValue: number = 0;

    private history : Array<number> = [];
    private maxHistoryLength = 100;

    private statistics: SensorStatistics = {
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        q1: 0,
        q3: 0
    };



    constructor(typeId: string, instanceId: string, unit: string){
        this.typeId = typeId;
        this.instanceId = instanceId;
        this.unit = unit;
    }

    public updateValue(value: number){
        this.currentValue = value;
        this.history.push(value);
        if(this.history.length > this.maxHistoryLength){          
            this.history.shift();
        }
        this.calculateStatistics();
    }

    /**
     *  @returns the history of the sensor
     */
    public getHistory(){
        return this.history;
    }

    /**
     * @returns the unit of the sensor
     */
    public getUnit(){
        return this.unit;
    }

    /**
     * get the type id
     * @returns the type id
     */
    public getTypeId(){
        return this.typeId;
    }

    /**
     * get the instance id
     * @returns the instance id
     */
    public getInstanceId(){
        return this.instanceId;
    }

    /**
     * 
     * @returns the current value
     */
    public getCurrentValue(){
        return this.currentValue;
    }

    /**
     * 
     * @returns the statistics of the sensor
     */
    public getStatistics(){       
        return this.statistics;
    }

    /**
     * 
     * @returns the median of the values
     */
    private calculateMedian(values: number[] = this.history){
        const sorted = values.sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        }
        return sorted[middle];
    }

    /**
     * 
     * @returns the first quartile
     */
    private calculateQ1(values: number[] = this.history){
        const sorted = values.sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        const q1 = sorted.slice(0, middle);
        return this.calculateMedian(q1);
    }

    /**
     * 
     * @returns the third quartile
     */
    private calculateQ3(values: number[] = this.history){
        const sorted = values.sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        const q3 = sorted.slice(middle + 1);
        return this.calculateMedian(q3);
    }

    /**
     * calculates the statistics
     */
    private calculateStatistics(){
      
        this.statistics.min = Math.min(...this.history);
        this.statistics.max = Math.max(...this.history);
        this.statistics.avg = this.history.reduce((a, b) => a + b, 0) / this.history.length;
        this.statistics.median = this.calculateMedian(this.history);
        this.statistics.q1 = this.calculateQ1(this.history);
        this.statistics.q3 = this.calculateQ3(this.history);
    }

}

interface SensorStatistics{
    min: number;
    max: number;
    avg: number;
    median: number;
    q1: number;
    q3: number;
}

export {
    Sensor,
    SensorStatistics
};
