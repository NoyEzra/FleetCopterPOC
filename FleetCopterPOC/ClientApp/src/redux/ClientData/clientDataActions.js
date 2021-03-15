import axios from 'axios'
import { setFlyByState, setMarketingShotState, setPerimSweapState, setCriticalHolesState } from '../MissionButtons/missionButtonsActions'
import { setAlertOn } from '../Alert/alertActions'
import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS,
    SEND_DRONE_ERROR,
    DELETE_ERROR
} from './clientDataTypes'


export const sendDroneRequest = () => {
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

export const startConnection = (clientId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest())
        axios.get(`Ugcs/startConnection/?clientId=${clientId}`)
            .then(response => {
                const data = response.data;
                if (data.status === "success") {
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    dispatch(setAlertOn(true, data))
                }
            })
            .catch(error => {
                const errMsg = error.response.data
                console.log(errMsg)
            })
    }
}




export const sendDroneMission = (mission, clientId, vehicleId, midflight) => {
    return (dispatch) => {
        axios.get(`Ugcs/executeMission/?clientId=${clientId}&mission=${mission}&vehicleId=${vehicleId}&midflight=${midflight}`)
            .then(response => {
                const data = response.data
                if (data.status === "success") {
                    dispatch(sendDroneSuccess(data.droneData))
                    switch(mission){
                        case 'FlyBy':
                            dispatch(setFlyByState(true));
                            break;
                        case 'MarketingShot':
                            dispatch(setMarketingShotState(true));
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
                    dispatch(setAlertOn(true, data.errMsg))
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
                if (data.status === "success") {
                    dispatch(sendDroneSuccess(data.droneData));
                }
                else if (data.status === "error") {
                    dispatch(setAlertOn(true, data.errMsg))
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
                if (data.status === "success") {
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    dispatch(setAlertOn(true, data.errMsg))
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
                if (data.status === "success") {
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    dispatch(setAlertOn(true, data.errMsg))
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
                dispatch(setAlertOn(data.droneData))
            })
            .catch(error => {
                console.log(error);
            })
    }
}

export const isDroneAvailable = (clientId, vehicleId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest())
        axios.get(`Ugcs/isDroneAvailable/?clientId=${clientId}&vehicleId=${vehicleId}`)
            .then(response => {
                const data = response.data
                if (data.status === "success") {
                    return data.result;
                }
                else if (data.status === "error") {
                    dispatch(setAlertOn(true, data.errMsg))
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
}
