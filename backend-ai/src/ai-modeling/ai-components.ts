import { AccumulatorInputSender } from "../data-exchanger/accumulator_input_sender";
import { SensorConfig } from "../data-exchanger/sensor_input_fetcher";

class State<ValueType> {

    // name of the state
    private _name: string;
    // for multiple state of the same type
    private _type: string;

    constructor(name: string, type: string) {
        this._name = name;
        this._type = type;
    }

    /**
     * copies a state to prevent reference issues
     * @returns a copy of the state
     */
    public copyState(){
        return new State(this._name, this._type);
    }
    
    
    /**
     * Returns the name of the state
     */
    get name() {
        return this._name;
    }

 
    /**
     * Returns the type of the state
     */
    get type() {
        return this._type;
    }
}

class StateTransition{

    // method which resolves to boolean
    private _start : State<any>;
    private _end : State<any>;
    private _newVars = new Map<string, any>();
    private _condition : (state: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) => boolean;


    constructor(start: State<any>, end: State<any>, newVars: Map<string, any>, condition: (start: State<any>, varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) => boolean) {
        this._start = start;
        this._end = end;
        this._newVars = newVars;
        this._condition = condition;
    }

    get start() {
        return this._start;
    }

    get end() {
        return this._end;
    }

    get newVars() {
        return this._newVars;
    }
    
    public resolveCondition(varHisotry: VarHistory, sensorConfig: SensorConfig, accumulatorInputSender: AccumulatorInputSender) {
        return this._condition(this.start, varHisotry, sensorConfig, accumulatorInputSender);
    }
}


class Model {
    
    constructor(private _states: State<any>[], private _transitions: StateTransition[], private _sensors: SensorConfig) {
    
    }

    /**
     * Returns the states of the model
     */
    get states() {
        return this._states;
    }

    get sensors() {
        return this._sensors;
    }

    /**
     * Returns the transitions of the model
     */
    get transitions() {
        return this._transitions;
    }
    
     
}

class VarHistory{

    private _varHistory: Map<string, any[]> = new Map<string, any[]>();
    // previous iterations
    private _iterations: Array<any> = [];

    private _maxIterations = 100;


    constructor(){

    }

    /**
     *  get the value of a variable
     * @param key 
     * @returns 
     */
    get(key: string){
        return this._varHistory.get(key);
    }

    /**
     * set the value of a variable
     * @param key 
     * @param value 
     */
    set(key: string, value: any){
        this._varHistory.set(key, value);
    }

    /**
     * add a version of a variable
     * @param key 
     * @param value 
     */
    addVersion(key: string, value: any){
        let oldValue = this._varHistory.get(key);
        if (oldValue) {
            oldValue.push(value);
        }else {
            this._varHistory.set(key, [value]);
        }
    }

    /**
     * check if a variable exists
     * @param key 
     * @returns 
     */
    has(key: string){
        return this._varHistory.has(key);
    }

    getIterations(){
        return this._iterations;
    }

    /**
     * 
     * @param iteration 
     */
    addIteration(iteration: any){
        this._iterations.push(iteration);
        if(this._iterations.length > this._maxIterations){
            this._iterations.shift();
        }
    }

    /**
     * 
     * @returns the latest iteration
     */
    createIteration(){
        let iteration : any = {};
        this._varHistory.forEach((value, key) => {
            iteration[key] = value[value.length - 1];
        });
        this.addIteration(iteration);
        return iteration;
    }

    getLatestIteration(){
        if(this._iterations.length === 0){
            return {};
        }
        return this._iterations[this._iterations.length - 1];
    }


    

    
    
}


class Iterations{

    private _stateHistory: State<any>[] = [];

    private _model : Model;
    
    private _varHistory: VarHistory = new VarHistory();

    private _logEnabled = false;

    private _accumulatorInputSender: AccumulatorInputSender;

    constructor(model: Model, initValues: Map<string, any>, initState: State<any>, accumulatorInputSender: AccumulatorInputSender, options?: any){
        this._model = model;
        this.initVarHistory(initValues);
        this._stateHistory.push(initState);
        this._accumulatorInputSender = accumulatorInputSender;
        if (options && options.enableLog !== undefined) {
            this._logEnabled = options.enableLog;
        }
    }

    private initVarHistory(initValues: Map<string, any>) {
        this._model.states.forEach(state => {
            this._varHistory.set(state.name, []);
        });

        // init values 
        initValues.forEach((value, key) => {
            if(this._varHistory.has(key)){
                let oldValue = this._varHistory.get(key);
                if (oldValue) {
                    oldValue.push(value);
                }else {
                    this._varHistory.set(key, [value]);
                }
            }            
        });
        // create a new iteration history
        this._varHistory.createIteration();
    }

    get model() {
        return this._model;
    }

    get varHistory() {
        return this._varHistory;
    }
    
    private createLogEntry(){
        // current state
        let currentState = this._stateHistory[this._stateHistory.length - 1];
        // current variables
        let currentVars = this._varHistory.get(currentState.name);

        // iteration index
        let iterationIndex = this._stateHistory.length - 1;

        return JSON.stringify({
            iteration: iterationIndex,
            state: currentState,
            vars: currentVars
        });
    }

    private log(){
        if(!this._logEnabled){
            return;
        }
        console.log(this.createLogEntry());
    }

    runNextIteration() {
        this.log();
       // get possible transitions
        let possibleTransitions = this._model.transitions.filter(transition => transition.start.name === this._stateHistory[this._stateHistory.length - 1].name);
        // find the first transition that resolves to true
        let resolvedTransition = possibleTransitions.find(transition => transition.resolveCondition(this._varHistory, this._model.sensors, this._accumulatorInputSender));
        // set the new state
        if(resolvedTransition){
            this._stateHistory.push(resolvedTransition.end);
            // set the new variables
            resolvedTransition.newVars.forEach((value, key) => {
                let oldValue = this._varHistory.get(key);
                if (oldValue) {
                    oldValue.push(value);
                }else {
                    this._varHistory.set(key, [value]);
                }
            });
        }
    }
}


export {Model, State, StateTransition, Iterations, VarHistory};