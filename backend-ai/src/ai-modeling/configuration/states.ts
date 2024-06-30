import { State } from "../ai-components";

export default class STATES {
    public static readonly START = new State("START", "start");
    public static readonly CHECK_DATE = new State("checkDate", "checkDate");
    public static readonly CHECK_HUMIDITY = new State("checkHumidity", "checkHumidity");
    public static readonly CHECK_TEMPERATURE = new State("checkTemperature", "checkTemperature");
    public static readonly OPEN_WINDOW_1 = new State("open_window_1", "opening_window");
    public static readonly OPEN_WINDOW_2 = new State("open_window_2", "opening_window");
    public static readonly CLOSE_WINDOW_1 = new State("close_window_1", "closing_window");
    public static readonly CLOSE_WINDOW_2 = new State("close_window_2", "closing_window");

    public static readonly ALL_STATES = [
        STATES.START,
        STATES.CHECK_DATE,
        STATES.CHECK_HUMIDITY,
        STATES.CHECK_TEMPERATURE,
        STATES.OPEN_WINDOW_1,
        STATES.OPEN_WINDOW_2,
        STATES.CLOSE_WINDOW_1,
        STATES.CLOSE_WINDOW_2
    ];
}