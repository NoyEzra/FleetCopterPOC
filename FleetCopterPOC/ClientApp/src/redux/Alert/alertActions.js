import { 
    SET_ALERT_ON,
    SET_ALERT_OFF } from './alertTypes'

    export const sendAlertOn = () => {
        return{
            type: SET_ALERT_ON
        }
    }

    export const sendAlertOff = () => {
        return{
            type: SET_ALERT_OFF
        }
    }

    export const setAlertOn = () => {
        return (dispatch) => {
            dispatch(sendAlertOn());
        }
    }

    export const setAlertOff = () => {
        return (dispatch) => {
            dispatch(sendAlertOff());
        }
    }