export default class Sensor {

    private typeId: string;
    private instanceId: string;
    private unit: string[];
    private currentValue: number[] = [0];
    private labels: string[] = [];

    // the first layer are the different value types, i.e temperature and humidity, the second layer are the values
    private history : Array<Array<number>> = [[]];
    private maxHistoryLength = 100;

    private statistics: SensorStatistics = {
        min: [0],
        max: [0],
        avg: [0],
        median: [0],
        q1: [0],
        q3: [0],
    };



    constructor(typeId: string, instanceId: string, unit: string, labels: string){
        this.typeId = typeId;
        this.instanceId = instanceId;
        this.unit = unit.split(",");
        this.labels = labels.split(",");
        const his: number[][] = [];
        const currentVa: number[] = [];
        this.unit.forEach(() => {
            his.push([]);
            currentVa.push(0);
        });
        this.history = his;
        this.currentValue = currentVa;
    }

    public updateValue(value: number | number[]){



        // check if is array
        let addVal = Array.isArray(value) ? value : [value];

        this.currentValue = addVal;

        this.history.forEach((arr, index) => {
            arr.push(addVal[index]);
            if(arr.length > this.maxHistoryLength){
                arr.shift();
            }
        });
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
    private calculateMedian(values: number[][] = this.history) : number[]{
        let medians = [];
        for(let i = 0; i < values.length; i++){
            const sorted = values[i].sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);
            if (sorted.length % 2 === 0) {
                medians.push((sorted[middle - 1] + sorted[middle]) / 2);
            }else{
                medians.push(sorted[middle]);
            }
        }
        return medians;
    }

    /**
     * 
     * @returns the first quartile
     */
    private calculateQ1(values: number[][] = this.history){
        let res = [];
        for(let i = 0; i < values.length; i++){
            const sorted = values[i].sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);
            const q1 = sorted.slice(0, middle);
            res.push(this.calculateMedian([q1])[0]);
        }
        return res;
    }

    /**
     * 
     * @returns the third quartile
     */
    private calculateQ3(values: number[][] = this.history){
        let res = [];
        for(let i = 0; i < values.length; i++){
            const sorted = values[i].sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);
            const q3 = sorted.slice(middle + 1);
            res.push(this.calculateMedian([q3])[0]);
        }
        return res;
    }

    /**
     * calculates the statistics
     */
    private calculateStatistics(){      
        this.statistics.min = this.history.map(arr => Math.min(...arr));
        this.statistics.max = this.history.map(arr => Math.max(...arr));
        this.statistics.avg = this.history.map(arr => arr.reduce((a, b) => a + b, 0) / arr.length);
        this.statistics.median = this.calculateMedian(this.history);
        this.statistics.q1 = this.calculateQ1(this.history);
        this.statistics.q3 = this.calculateQ3(this.history);
    }

}

interface SensorStatistics{    
    min: number[];
    max: number[];
    avg: number[];
    median: number[];
    q1: number[];
    q3: number[];
}

export {
    Sensor,
    SensorStatistics
};
