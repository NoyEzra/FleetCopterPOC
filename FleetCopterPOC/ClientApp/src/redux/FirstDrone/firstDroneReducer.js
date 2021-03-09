import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS,
    SEND_DRONE_ERROR
} from './firstDroneTypes'



const initialState = {
    loading: true,
    clientId: 0,
    droneData: { },
    error: false,
    errMsg: '',
    changed: false
}


const firstDroneReducer = (state = initialState, acion) => {
    console.log(acion)
    switch (acion.type) {
        case SEND_DRONE_REQUEST: 
            return {
                ...state,
                loading: true,
                error: false,
                errMsg: '',
            }
        case SEND_DRONE_SUCCESS:
            console.log("inside success")
            console.log(acion.payload)
            console.log(typeof acion.payload)
            const jsonPayload = JSON.parse(acion.payload)
            console.log(state)
            return {
                loading: false,
                clientId: jsonPayload.clientId,
                droneData: jsonPayload,
                error: false,
                errMsg: '',
                changed: !state.changed
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