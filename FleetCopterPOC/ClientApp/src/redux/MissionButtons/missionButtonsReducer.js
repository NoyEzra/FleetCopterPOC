import { 
    SET_FLY_BY,
    SET_MARKETING_SHOT,
    SET_PERIM_SWEAP,
    SET_CRITICAL_HOLES } from './missionButtonsTypes'


const initialState = {
    flyBy: false,
    flyByDrone: 1,
    marketingShot: false,
    marketingShotDrone: 1,
    perimSweap: false,
    perimSweapDrone: 1,
    criticalHoles: false,
    criticalHolesDrone: 1
}

const missionButtonsReducer = (state = initialState, acion) => {
    switch(acion.type){
        case SET_FLY_BY: 
            return {
                ...state,
                flyBy: acion.payload.state,
                flyByDrone: acion.payload.drone
            }
        case SET_MARKETING_SHOT: 
            return {
                ...state,
                marketingShot: acion.payload.state,
                marketingShotDrone: acion.payload.drone
            }
        case SET_PERIM_SWEAP: 
            return {
                ...state,
                perimSweap: acion.payload.state,
                perimSweapDrone: acion.payload.drone
            }
        case SET_CRITICAL_HOLES: 
            return {
                ...state,
                criticalHoles: acion.payload.state,
                criticalHolesDrone: acion.payload.drone
            }
        default: return state
    }
}

export default missionButtonsReducer