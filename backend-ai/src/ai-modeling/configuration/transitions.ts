import { Iterations, State, StateTransition } from "../ai-components";
import STATES from "./states";

export default class TRANSISITIONS {

    public static readonly START_TO_CHECK_DATE = new StateTransition(STATES.START, STATES.CHECK_DATE, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    }
    );

    public static readonly CHECK_DATE_TO_OPEN_WINDOW_1 = new StateTransition(STATES.CHECK_DATE, STATES.OPEN_WINDOW_1, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly OPEN_WINDOW_1_TO_OPEN_WINDOW_2 = new StateTransition(STATES.OPEN_WINDOW_1, STATES.OPEN_WINDOW_2, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_DATE_TO_CHECK_HUMIDITY = new StateTransition(STATES.CHECK_DATE, STATES.CHECK_HUMIDITY, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_HUMIDITY_TO_CHECK_TEMPERATURE = new StateTransition(STATES.CHECK_HUMIDITY, STATES.CHECK_TEMPERATURE, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });


    public static readonly CHECK_TEMPERATURE_TO_OPEN_WINDOW_1 = new StateTransition(
        STATES.CHECK_TEMPERATURE, STATES.OPEN_WINDOW_1,
        new Map(Object.entries({window1: 'open'})), 
        (state: State<any>, iterations: Iterations) => {
            return false;
    });

    public static readonly CHECK_TEMPERATURE_TO_OPEN_WINDOW_2 = new StateTransition(
        STATES.CHECK_TEMPERATURE, STATES.OPEN_WINDOW_1, 
        new Map(Object.entries({window2: 'open'})), 
        (state: State<any>, iterations: Iterations) => {
            return false;
    });

    public static readonly OPEN_WINDOW_1_TO_START = new StateTransition(STATES.OPEN_WINDOW_1, STATES.START, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly OPEN_WINDOW_2_TO_START = new StateTransition(STATES.OPEN_WINDOW_2, STATES.START, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_HUMIDITY_TO_START = new StateTransition(STATES.CHECK_HUMIDITY, STATES.START, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_TEMPERATURE_TO_START = new StateTransition(STATES.CHECK_TEMPERATURE, STATES.START, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_DATE_TO_CLOSE_WINDOW_1 = new StateTransition(STATES.CHECK_DATE, STATES.CLOSE_WINDOW_1,
        new Map(Object.entries({window1: 'closed'})), 
         (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_DATE_TO_CLOSE_WINDOW_2 = new StateTransition(STATES.CHECK_DATE, STATES.CLOSE_WINDOW_2,
        new Map(Object.entries({window2: 'closed'})) ,
          (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CLOSE_WINDOW_1_TO_START = new StateTransition(STATES.CLOSE_WINDOW_1, STATES.START, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CLOSE_WINDOW_2_TO_START = new StateTransition(STATES.CLOSE_WINDOW_2, STATES.START, new Map<string, any>(), (state: State<any>, iterations: Iterations) => {
        return false;
    });


    public static readonly CHECK_HUMIDITY_TO_CLOSE_WINDOW_1 = new StateTransition(
        STATES.CHECK_HUMIDITY, STATES.CLOSE_WINDOW_1, 
        new Map(Object.entries({window1: 'closed'})), 
        (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_HUMIDITY_TO_CLOSE_WINDOW_2 = new StateTransition(
        STATES.CHECK_HUMIDITY, STATES.CLOSE_WINDOW_2, 
        new Map(Object.entries({window2: 'closed'})),
        (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_TEMPERATURE_TO_CLOSE_WINDOW_1 = new StateTransition(
        STATES.CHECK_TEMPERATURE, STATES.CLOSE_WINDOW_1, 
        new Map(Object.entries({window1: 'closed'})), 
        (state: State<any>, iterations: Iterations) => {
        return false;
    });

    public static readonly CHECK_TEMPERATURE_TO_CLOSE_WINDOW_2 = new StateTransition(
        STATES.CHECK_TEMPERATURE, STATES.CLOSE_WINDOW_2, 
        new Map(Object.entries({window2: 'closed'})),
        (state: State<any>, iterations: Iterations) => {
        return false;
    });


    public static readonly ALL_TRANSITIONS = [
        TRANSISITIONS.START_TO_CHECK_DATE,
        TRANSISITIONS.CHECK_DATE_TO_OPEN_WINDOW_1,
        TRANSISITIONS.OPEN_WINDOW_1_TO_OPEN_WINDOW_2,
        TRANSISITIONS.CHECK_DATE_TO_CHECK_HUMIDITY,
        TRANSISITIONS.CHECK_HUMIDITY_TO_CHECK_TEMPERATURE,
        TRANSISITIONS.CHECK_TEMPERATURE_TO_OPEN_WINDOW_1,
        TRANSISITIONS.CHECK_TEMPERATURE_TO_OPEN_WINDOW_2,
        TRANSISITIONS.OPEN_WINDOW_1_TO_START,
        TRANSISITIONS.OPEN_WINDOW_2_TO_START,
        TRANSISITIONS.CHECK_HUMIDITY_TO_START,
        TRANSISITIONS.CHECK_TEMPERATURE_TO_START,
        TRANSISITIONS.CHECK_DATE_TO_CLOSE_WINDOW_1,
        TRANSISITIONS.CHECK_DATE_TO_CLOSE_WINDOW_2,
        TRANSISITIONS.CLOSE_WINDOW_1_TO_START,
        TRANSISITIONS.CLOSE_WINDOW_2_TO_START,
        TRANSISITIONS.CHECK_HUMIDITY_TO_CLOSE_WINDOW_1,
        TRANSISITIONS.CHECK_HUMIDITY_TO_CLOSE_WINDOW_2,
        TRANSISITIONS.CHECK_TEMPERATURE_TO_CLOSE_WINDOW_1,
        TRANSISITIONS.CHECK_TEMPERATURE_TO_CLOSE_WINDOW_2
    ]


    









}