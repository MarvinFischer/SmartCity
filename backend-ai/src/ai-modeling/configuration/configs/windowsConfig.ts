export default interface WindowConfig {


    open: {
        minTemp: { value: number, sensors: string[] },
        minHumidity: { value: number, sensors: string[] },
        onlyOnDays: string[],
        vars: { stateVar: string }
    },

    close: {
        maxTemp: { value: number, sensors: string[] },
        maxHumidity: number,
        vars: { stateVar: string }
    }


}