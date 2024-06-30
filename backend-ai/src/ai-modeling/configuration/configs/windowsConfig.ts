export default interface WindowConfig {


    open: {
        minTemp: { value: number, sensors: string[] },
        minHumidity: { value: number, sensors: string[] },
        onlyOnDays: string[],
        vars: { stateVar: string }
    },

    close: {
        maxTemp: { value: number, sensors: string[] },
        maxHumidity: { value: number, sensors: string[] },
        vars: { stateVar: string }
    }


}