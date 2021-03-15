import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS
} from './clientDataTypes'



const initialState = {
    loading: true,
    clientId: 0,
    droneData: { },
    changed: false
}


const clientDataReducer = (state = initialState, acion) => {
    switch (acion.type) {
        case SEND_DRONE_REQUEST: 
            return {
                ...state,
                loading: true,
            }
        case SEND_DRONE_SUCCESS:
            const jsonPayload = JSON.parse(acion.payload)
            return {
                loading: false,
                clientId: jsonPayload.clientId,
                droneData: jsonPayload,
                error: false,
                errMsg: '',
                changed: !state.changed
            }
        default: return state
    }
}

export default clientDataReducer