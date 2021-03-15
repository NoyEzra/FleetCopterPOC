import {SET_DRONE1,
    SET_DRONE2,
    SET_CHOSEN_DRONE} from './activeDronesTypes'



export const setActiveDrone1 = (vId, mission, idx) => {
    return{
        type: SET_DRONE1,
        payload: {id: vId,
                  mission: mission,
                  idx: idx}
    }
}

export const setActiveDrone2 = (vId, mission, idx) => {
    return{
        type: SET_DRONE2,
        payload: {id: vId,
                  mission: mission,
                  idx: idx}
    }
}

export const setChosenDrone = (num) => {
    return{
        type: SET_CHOSEN_DRONE,
        payload: num
    }
}


export const activateDrone1 = (vehicleId, mission, idx) => {
    return (dispatch) => {
        dispatch(setActiveDrone1(vehicleId, mission, idx))
    }
}

export const deactivateDrone1 = () => {
    return (dispatch) => {
        dispatch(setActiveDrone1(0, '', 0))
    }
}

export const activateDrone2 = (vehicleId, mission, idx) => {
    return (dispatch) => {
        dispatch(setActiveDrone2(vehicleId, mission, idx))
    }
}

export const deactivateDrone2 = () => {
    return (dispatch) => {
        dispatch(setActiveDrone1(2, '', 0))
    }
}

export const cngChosenDrone = (num) => {
    return (dispatch) => {
        dispatch(setChosenDrone(num))
    }
}