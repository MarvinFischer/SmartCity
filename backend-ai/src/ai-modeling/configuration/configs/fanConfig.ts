export default interface FanConfig {


    turnOn: {
        minTemp: { value: number, sensors: string[] },
        minHumidity: { value: number, sensors: string[] },
        onlyOnDays: string[],
        vars: { stateVar: string }
    },

    turnOff: {
        maxTemp: { value: number, sensors: string[] },
        maxHumidity: { value: number, sensors: string[] },
        vars: { stateVar: string }
    }


}