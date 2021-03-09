import axios from 'axios'
import {setFlyByState, setBeautyShotState, setPerimSweapState, setCriticalHolesState} from '../MissionButtons/missionButtonsActions'
import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS,
    SEND_DRONE_ERROR } from './firstDroneTypes'

export const sendDroneRequest = () => {
    console.log("inside send drone req")
    return{
        type: SEND_DRONE_REQUEST
    }
}

export const sendDroneSuccess = droneData => {
    return{
        type: SEND_DRONE_SUCCESS,
        payload: droneData
    }
}

export const sendDroneError = error => {
    return{
        type: SEND_DRONE_ERROR,
        payload: error
    }
}

export const startConnection = (clientId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest())
        axios.get(`Ugcs/startConnection/?clientId=${clientId}`)
            .then(response => {
                const data = response.data;
                console.log("startConnection");
                console.log(data);
                console.log(data.droneData);
                if (data.status === "success") {
                    console.log("startConnection finish dispatch")                    
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    console.log(data)
                    dispatch(sendDroneError(data))
                }
            })
            .catch(error => {
                const errMsg = error.response.data
                console.log(errMsg)
            })
    }
}




export const sendDroneMission = (mission, clientId, vehicleId) => {
    return (dispatch) => {
        axios.get(`Ugcs/executeMission/?clientId=${clientId}&mission=${mission}&vehicleId=${vehicleId}`)
            .then(response => {
                const data = response.data
                console.log(data)
                if (data.status === "success") {
                    console.log("mission calling reducer")
                    console.log(clientId)
                    dispatch(sendDroneSuccess(data.droneData))
                    switch(mission){
                        case 'FlyBy':
                            dispatch(setFlyByState(true));
                            break;
                        case 'BeautyShot':
                            dispatch(setBeautyShotState(true));
                            break;
                        case 'CriticalHoles':
                            dispatch(setCriticalHolesState(true));
                            break;
                        case 'PerimSweap':
                            dispatch(setPerimSweapState(true));
                            break;
                    }
                }
                else if (data.status === "error") {
                    console.log(data)
                    dispatch(sendDroneError(data))
                    return false;
                }
            })
            .catch(error => {
                const errMsg = error.response.data
                console.log(errMsg)
                return false;
            })
    }
}

export const sendDronePause = (clientId,vehicleId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest);
        axios.get(`Ugcs/pauseMission?clientId=${clientId}&vehicleId=${vehicleId}`)
            .then(response => {
                const data = response.data;
                console.log(data)
                if (data.status === "success") {
                    //console.log("pause calling reducer")
                    dispatch(sendDroneSuccess(data.droneData));
                }
                else if (data.status === "error") {
                    console.log(data);
                }
                
            })
            .catch(error => {
                const errMsg = error.response.data;
                console.log(errMsg);
            })
    }
}

export const sendDroneResume = (clientId,vehicleId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest)
        axios.get(`Ugcs/resumeMission?clientId=${clientId}&vehicleId=${vehicleId}`)
            .then(response => {
                const data = response.data
                console.log(data)
                if (data.status === "success") {
                    //console.log("backHome calling reducer")
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    console.log(data)
                }
            })
            .catch(error => {
                const errMsg = error.response.data
                console.log(errMsg)
            })
    }
}

export const sendDroneReturnHome = (clientId,vehicleId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest)
        axios.get(`Ugcs/returnHomeMission?clientId=${clientId}&vehicleId=${vehicleId}`)
            .then(response => {
                const data = response.data
                //console.log(data)
                if (data.status === "success") {
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    console.log(data)
                }
            })
            .catch(error => {
                const errMsg = error.response.data
                console.log(errMsg)
            })
    }
}


export const updateDroneData = (clientId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest())
        axios.get(`Ugcs/updateDronesData/?clientId=${clientId}`)
            .then(response => {
                const data = response.data
                console.log("updateDronData calling reducer")
                dispatch(sendDroneSuccess(data.droneData))
            })
            .catch(error => {
                console.log(error);
            })
    }
}