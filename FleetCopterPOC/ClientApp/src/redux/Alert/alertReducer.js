import { 
    SET_ALERT_ON,
    SET_ALERT_OFF } from './alertTypes'

const initialState = {
    alertOn: false
}

const alertReducer = (state=initialState,acion) => {
    switch(acion.type){
        case SET_ALERT_ON: 
            return {
                alertOn: true
            }
        case SET_ALERT_OFF:
            return {
                alertOn: false  
            }
        default: return state
    }
}

export default alertReducer