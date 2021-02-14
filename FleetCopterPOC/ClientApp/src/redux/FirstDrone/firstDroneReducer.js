import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS,
    SEND_DRONE_ERROR } from './firstDroneTypes'

const initialState = {
    loading: true,
    droneData: {},
    error:''
}

const firstDroneReducer = (state=initialState,acion) => {
    switch(acion.type){
        case SEND_DRONE_REQUEST: 
            return {
                ...state,
                loading: true
            }
        case SEND_DRONE_SUCCESS:
            return {
                loading: false,
                droneData: acion.payload,
                error: ''
            }
        case SEND_DRONE_ERROR:
            return {
                loading: false,
                droneData: {},
                error: acion.payload
            }
        default: return state
    }
}

export default firstDroneReducer