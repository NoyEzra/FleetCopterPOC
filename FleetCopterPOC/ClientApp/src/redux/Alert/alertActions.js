import { 
    SET_ALERT_ERR_ON,
    SET_ALERT_ERR_OFF,
    SET_ALERT_INF_ON,
    SET_ALERT_INF_OFF } from './alertTypes'

    export const sendAlertErrOn = (errMsg) => {
        return{
            type: SET_ALERT_ERR_ON,
            msg: errMsg
        }
    }

    export const sendAlertErrOff = () => {
        return{
            type: SET_ALERT_ERR_OFF
        }
    }

    export const sendAlertInfOn = (errMsg) => {
        return {
            type: SET_ALERT_INF_ON,
            msg: errMsg
        }
    }

    export const sendAlertInfOff = () => {
        return {
            type: SET_ALERT_INF_OFF
        }
    }


    export const setAlertOn = (err, msg) => {
        if (err) {
            return (dispatch) => {
                dispatch(sendAlertErrOn(msg));
            }
        }
        return (dispatch) => {
            dispatch(sendAlertInfOn(msg));
        }

    }

    export const setAlertOff = (err) => {
        if (err) {
            return (dispatch) => {
                dispatch(sendAlertErrOff());
            }
        }
        return (dispatch) => {
            dispatch(sendAlertInfOff());
        }

    }