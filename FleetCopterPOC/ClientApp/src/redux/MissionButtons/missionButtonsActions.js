
import { 
    SET_FLY_BY,
    SET_MARKETING_SHOT,
    SET_PERIM_SWEAP,
    SET_CRITICAL_HOLES } from './missionButtonsTypes'

export const setFlyBy = (state, drone) => {
    return{
        type: SET_FLY_BY,
        payload: {state: state,
            drone: drone}
    }
}

export const setMarketingShot = (state, drone) => {
    return{
        type: SET_MARKETING_SHOT,
        payload: {state: state,
            drone: drone}
    }
}

export const setPerimSweap = (state, drone) => {
    return{
        type: SET_PERIM_SWEAP,
        payload: {state: state,
            drone: drone}
    }
}

export const setCriticalHoles = (state, drone) => {
    return{
        type: SET_CRITICAL_HOLES,
        payload: {state: state,
                drone: drone}
    }
}


export const setFlyByState = (bState, drone) => {
    return (dispatch) => {
        dispatch(setFlyBy(bState, drone));
    }
}

export const setPerimSweapState = (bState, drone) => {
    return (dispatch) => {
        dispatch(setPerimSweap(bState, drone));
    }
}

export const setMarketingShotState = (bState, drone) => {
    return (dispatch) => {
        dispatch(setMarketingShot(bState, drone));
    }
}

export const setCriticalHolesState = (bState, drone) => {
    return (dispatch) => {
        dispatch(setCriticalHoles(bState, drone));
    }
}