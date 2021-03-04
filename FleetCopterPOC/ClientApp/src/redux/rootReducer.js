import { combineReducers } from 'redux'
import firstDroneReducer from './FirstDrone/firstDroneReducer'
import alertReducer from './Alert/alertReducer'

const rootReducer = combineReducers({
    firstDrone: firstDroneReducer,
    alert: alertReducer
})

export default rootReducer