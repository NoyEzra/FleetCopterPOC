import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS,
    SEND_DRONE_ERROR } from './firstDroneTypes'

const initialState = {
    loading: true,
    droneData: { },
    error: false,
    errMsg: ''
}

const firstDroneReducer = (state = initialState, acion) => {
    console.log(state)
    switch(acion.type){
        case SEND_DRONE_REQUEST: 
            return {
                ...state,
                loading: true,
                error: false,
                errMsg: ''
            }
        case SEND_DRONE_SUCCESS:
            console.log(typeof acion.payload)
            return {
                loading: false,
                droneData: acion.payload,
                error: false,
                errMsg: ''
            } 
        case SEND_DRONE_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
                errMsg: acion.payload.errMsg
            }
        default: return state
    }
}

export default firstDroneReducer