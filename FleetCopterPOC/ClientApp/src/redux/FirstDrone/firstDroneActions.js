import axios from 'axios'
import { 
    SEND_DRONE_REQUEST,
    SEND_DRONE_SUCCESS,
    SEND_DRONE_ERROR } from './firstDroneTypes'

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

export const sendDroneError = error => {
    return{
        type: SEND_DRONE_ERROR,
        payload: error
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
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    dispatch(sendDroneError(data))
                }
            })
            .catch(error => {
                const errMsg = error.message
                console.log(error.response.data)
                dispatch(sendDroneError(errMsg))
            })
    }
}

export const sendDronePause = (clientId,vehicleId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest)
        axios.get(`Ugcs/pauseMission?clientId=${clientId}&vehicleId=${vehicleId}`)
            .then(response => {
                const data = response.data
                console.log(data)
                if (data.status === "success") {
                    console.log("pause calling reducer")
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    dispatch(sendDroneError(data))
                }
                
            })
            .catch(error => {
                const errMsg = error.message
                console.log(errMsg)
                dispatch(sendDroneError(errMsg))
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
                    console.log("backHome calling reducer")
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status === "error") {
                    dispatch(sendDroneError(data))
                }
            })
            .catch(error => {
                const errMsg = error.message
                console.log(errMsg)
                dispatch(sendDroneError(errMsg))
            })
    }
}

export const sendDroneReturnHome = (clientId,vehicleId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest)
        axios.get(`Ugcs/returnHomeMission?clientId=${clientId}&vehicleId=${vehicleId}`)
            .then(response => {
                const data = response.data
                console.log(data)
                if (data.status == "success") {
                    console.log("backHome calling reducer")
                    dispatch(sendDroneSuccess(data.droneData))
                }
                else if (data.status == "error") {
                    console.log("In errorrrrr")
                    dispatch(sendDroneError(data))
                }
            })
            .catch(error => {
                const errMsg = error.message
                console.log(errMsg)
                dispatch(sendDroneError(errMsg))
            })
    }
}


export const updateDroneData = (clientId) => {
    console.log("client id")
    console.log(clientId)
    return (dispatch) => {
        axios.get(`Ugcs/updateDronesData/?clientId=${clientId}`)
            .then(response => {
                const data = response.data
                console.log("updateDronData calling reducer")
                dispatch(sendDroneSuccess(data))
                console.log("droneDate!!!!!!!!!!!!!!!!!!!!")
                console.log(data)
                return data.droneData.clientId;
            })
            .catch(error => {
                const errMsg = error.message
                console.log(errMsg)
                dispatch(sendDroneError(errMsg))
            })
    }
}