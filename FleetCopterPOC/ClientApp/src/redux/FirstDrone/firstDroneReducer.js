import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS,
    SEND_DRONE_ERROR } from './firstDroneTypes'

const initialState = {
    loading: true,
    droneData: {},
    error: false,
    errMsg: ''
}

const firstDroneReducer = (state = initialState, acion) => {
    console.log("start reducer")
    console.log(state)
    console.log(acion.type)
    console.log("end reducer")
    switch(acion.type){
        case SEND_DRONE_REQUEST: 
            return {
                ...state,
                loading: true,
                error: false,
                errMsg: ''
            }
        case SEND_DRONE_SUCCESS:
            console.log(acion.payload)
            console.log("end reducer")
            return {
                loading: false,
                droneData: acion.payload,
                error: false,
                errMsg: ''
            }
        case SEND_DRONE_ERROR:
            console.log("In error case!!");
            return {
                loading: false,
                droneData: {},
                error: true,
                errMsg: acion.payload.errMsg
            }
        default: return state
    }
}

export default firstDroneReducer