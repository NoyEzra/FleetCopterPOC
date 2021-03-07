import { combineReducers } from 'redux'
import firstDroneReducer from './FirstDrone/firstDroneReducer'
import alertReducer from './Alert/alertReducer'
import missionButtonsReducer from './MissionButtons/missionButtonsReducer'

const rootReducer = combineReducers({
    firstDrone: firstDroneReducer,
    alert: alertReducer,
    missionButtons: missionButtonsReducer
})

export default rootReducer