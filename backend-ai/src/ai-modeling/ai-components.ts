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
    private _condition : (state: State<any>, iterations: Iterations) => boolean;


    constructor(start: State<any>, end: State<any>, newVars: Map<string, any>, condition: (start: State<any>, iterations: Iterations) => boolean) {
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
    
    public resolveCondition(iterations: Iterations) {
        return this._condition(this.start, iterations);
    }
}


class Model {
    
    constructor(private _states: State<any>[], private _transitions: StateTransition[]) {
    
    }

    /**
     * Returns the states of the model
     */
    get states() {
        return this._states;
    }

    /**
     * Returns the transitions of the model
     */
    get transitions() {
        return this._transitions;
    }
    
     
}



class Iterations{

    private _stateHistory: State<any>[] = [];

    private _model : Model;
    
    private _varHistory: Map<string, any[]> = new Map<string, any[]>();

    private _logEnabled = false;

    constructor(model: Model, initValues: Map<string, any>, initState: State<any>, options?: any){
        this._model = model;
        this.initVarHistory(initValues);
        this._stateHistory.push(initState);
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
        let resolvedTransition = possibleTransitions.find(transition => transition.resolveCondition(this));
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


export {Model, State, StateTransition, Iterations};