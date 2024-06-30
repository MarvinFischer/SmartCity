export default interface WindowConfig {


    open: {
        minTemp: { value: number, sensors: string[] },
        minHumidity: { value: number, sensors: string[] },
        checkOutsideTemp: {value: boolean, sensors: string[], delta: number},
        onlyOnDays: string[],
        vars: { stateVar: string }
    },

    close: {
        maxTemp: { value: number, sensors: string[] },
        maxHumidity: { value: number, sensors: string[] },
        checkOutsideTemp: {value: boolean, sensors: string[], delta: number},
        vars: { stateVar: string }
    }


}