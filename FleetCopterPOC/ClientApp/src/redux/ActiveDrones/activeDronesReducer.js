import {SET_DRONE1,
     SET_DRONE2,
     SET_CHOSEN_DRONE} from './activeDronesTypes'

const initialState = {
    drone1Id: 0,
    drone1Mission: '',
    drone1Idx: 0,
    drone2Id: 1,
    drone2Mission:'',
    drone2Idx: 0,
    chosenDrone: 1
}

const activeDronesReducer = (state=initialState, acion) => {
    switch(acion.type){
        case 'SET_DRONE1':
            return {
                ...state,
                drone1Id: acion.payload.id,
                drone1Mission: acion.payload.mission,
                drone1Idx: acion.payload.idx
            }
        case 'SET_DRONE2':
            return {
                ...state,
                drone2Id: acion.payload.id,
                drone2Mission: acion.payload.mission,
                drone2Idx: acion.payload.idx
            }
        case 'SET_CHOSEN_DRONE':
            return{
                ...state,
                chosenDrone: acion.payload
            }
        default:
            return state
    }
}

export default activeDronesReducer