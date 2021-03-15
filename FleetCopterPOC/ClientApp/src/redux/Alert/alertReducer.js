import { 
    SET_ALERT_ERR_ON,
    SET_ALERT_ERR_OFF,
    SET_ALERT_INF_ON,
    SET_ALERT_INF_OFF
} from './alertTypes'

const initialState = {
    alertErrOn: false,
    errMsg: '',
    alertInfOn: false,
    infMsg: ''
}

const alertReducer = (state=initialState,acion) => {
    switch(acion.type){
        case SET_ALERT_ERR_ON: 
            return {
                alertErrOn: true,
                errMsg: acion.msg
            }
        case SET_ALERT_ERR_OFF:
            return {
                alertErrOn: false,
                errMsg: ''
            }
        case SET_ALERT_INF_ON:
            return {
                alertInfOn: true,
                infMsg: acion.msg
            }
        case SET_ALERT_INF_OFF:
            return {
                alertInfOn: false,
                infMsg: ''
            }
        default: return state
    }
}

export default alertReducer