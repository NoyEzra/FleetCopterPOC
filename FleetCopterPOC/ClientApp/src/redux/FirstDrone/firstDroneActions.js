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

export const sendDroneFlyBy = () => {
    return (dispatch) => {
        dispatch(sendDroneRequest)
        axios.get('Ugcs/executeMission/FlyBy')
            .then(response => {
                const droneData = response.data
                console.log(droneData)
                dispatch(sendDroneSuccess(droneData))
            })
            .catch(error => {
                const errMsg = error.message
                console.log(errMsg)
                dispatch(sendDroneError(errMsg))
            })
    }
}

export const sendDroneMission = (mission) => {
    return (dispatch) => {
        var requestUrl = 'Ugcs/executeMission/' + mission
        axios.get(requestUrl)
            .then(response => {
                const droneData = response.data
                console.log(droneData)
                dispatch(sendDroneSuccess(droneData))
            })
            .catch(error => {
                const errMsg = error.message
                console.log(errMsg)
                dispatch(sendDroneError(errMsg))
            })
    }
}

export const sendDronePause = (clientId,vehicleId) => {
    return (dispatch) => {
        dispatch(sendDroneRequest)
        axios.get(`Ugcs/pauseMission?clientId=${clientId}&vehicleId=${vehicleId}`)
            .then(response => {
                const droneData = response.data
                console.log(droneData)
                dispatch(sendDroneSuccess(droneData))
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
                const droneData = response.data
                console.log(droneData)
                dispatch(sendDroneSuccess(droneData))
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
                const droneData = response.data
                console.log(droneData)
                dispatch(sendDroneSuccess(droneData))
            })
            .catch(error => {
                const errMsg = error.message
                console.log(errMsg)
                dispatch(sendDroneError(errMsg))
            })
    }
}