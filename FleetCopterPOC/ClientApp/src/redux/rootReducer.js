import { combineReducers } from 'redux'
import clientDataReducer from './ClientData/clientDataReducer'
import alertReducer from './Alert/alertReducer'
import missionButtonsReducer from './MissionButtons/missionButtonsReducer'
import activeDronesReducer from './ActiveDrones/activeDronesReducer'

const rootReducer = combineReducers({
    clientData: clientDataReducer,
    alert: alertReducer,
    missionButtons: missionButtonsReducer,
    activeDrones: activeDronesReducer
})

export default rootReducer