import { combineReducers } from 'redux'
import firstDroneReducer from './FirstDrone/firstDroneReducer'

const rootReducer = combineReducers({
    firstDrone: firstDroneReducer
})

export default rootReducer