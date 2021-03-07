
import { 
    SET_FLY_BY,
    SET_BEAUTY_SHOT,
    SET_PERIM_SWEAP,
    SET_CRITICAL_HOLES } from './missionButtonsTypes'

export const setFlyBy = state => {
    return{
        type: SET_FLY_BY,
        payload: state
    }
}

export const setBeautyShot = state => {
    return{
        type: SET_BEAUTY_SHOT,
        payload: state
    }
}

export const setPerimSweap = state => {
    return{
        type: SET_PERIM_SWEAP,
        payload: state
    }
}

export const setCriticalHoles = state => {
    return{
        type: SET_CRITICAL_HOLES,
        payload: state
    }
}


export const setFlyByState = (bState) => {
    return (dispatch) => {
        dispatch(setFlyBy(bState));
    }
}

export const setPerimSweapState = (bState) => {
    return (dispatch) => {
        dispatch(setPerimSweap(bState));
    }
}

export const setBeautyShotState = (bState) => {
    return (dispatch) => {
        dispatch(setBeautyShot(bState));
    }
}

export const setCriticalHolesState = (bState) => {
    return (dispatch) => {
        dispatch(setCriticalHoles(bState));
    }
}