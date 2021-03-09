import { 
    SET_FLY_BY,
    SET_BEAUTY_SHOT,
    SET_PERIM_SWEAP,
    SET_CRITICAL_HOLES } from './missionButtonsTypes'


const initialState = {
    flyBy: false,
    beautyShot: false,
    perimSweap: false,
    criticalHoles: false,
}

const missionButtonsReducer = (state = initialState, acion) => {
    switch(acion.type){
        case SET_FLY_BY: 
            return {
                ...state,
                flyBy: acion.payload
            }
        case SET_BEAUTY_SHOT: 
            return {
                ...state,
                beautyShot: acion.payload
            }
        case SET_PERIM_SWEAP: 
            return {
                ...state,
                perimSweap: acion.payload
            }
        case SET_CRITICAL_HOLES: 
            return {
                ...state,
                criticalHoles: acion.payload
            }
        default: return state
    }
}

export default missionButtonsReducer