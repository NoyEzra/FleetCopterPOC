import React , {useState} from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo1.png';
import { sendDroneFlyBy } from '../redux';
import PopoverItem from './PopoverItem'


function HomeToolbar({ firstDroneData, sendDroneFlyBy, sendDroneMission }) {

    const [playerStatus,SetPlayerStatus] = useState(false)

    const handleFlyByClick = () => {
        sendDroneFlyBy()
        firstDroneData.loading ? 
        (console.log('loading FlyBy')) :
        firstDroneData.error ?
        (console.log(firstDroneData.error)) :
        SetPlayerStatus(firstDroneData.droneData && firstDroneData.droneData.droneDataArr[0] && firstDroneData.droneData.droneDataArr[0].isOnFlight)
    }

    const handleBeautyShotClick = () => {
        sendDroneMission('BeautyShot')
        firstDroneData.loading ?
            (console.log('loading BeautyShot')) :
            firstDroneData.error ?
                (console.log(firstDroneData.error)) :
                SetPlayerStatus(firstDroneData.droneData && firstDroneData.droneData.droneDataArr[0] && firstDroneData.droneData.droneDataArr[0].isOnFlight)
    }

    const handleCriticalHoles = () => {
        sendDroneMission('CriticalHoles')
        firstDroneData.loading ?
            (console.log('loading CriticalHoles')) :
            firstDroneData.error ?
                (console.log(firstDroneData.error)) :
                SetPlayerStatus(firstDroneData.droneData && firstDroneData.droneData.droneDataArr[0] && firstDroneData.droneData.droneDataArr[0].isOnFlight)
    }

    const handlePerimSweapClick = () => {
        sendDroneMission('PerimSweap')
        firstDroneData.loading ?
            (console.log('loading PerimSweap')) :
            firstDroneData.error ?
                (console.log(firstDroneData.error)) :
                SetPlayerStatus(firstDroneData.droneData && firstDroneData.droneData.droneDataArr[0] && firstDroneData.droneData.droneDataArr[0].isOnFlight)
    }

    /*
    const handleFlyByClick = async () => {
        const response = await fetch('Ugcs/executeMission')
        console.log("SUCCESS")
        console.log(response)
    }
    */

    return (
        <div className="buttonPanel">
            <img className="logo" src={logo} alt="Logo" />
            <button className="buttonPanel-btn">Fly To Point</button>
            <button className="buttonPanel-btn" onClick={handleBeautyShotClick}>Beauty Shot</button>
            <button className="buttonPanel-btn" onClick={handleFlyByClick}>FlyBy</button>
            <button className="buttonPanel-btn" onClick={handleCriticalHoles}>Critical Holes</button>
            <button className="buttonPanel-btn" onClicl={handlePerimSweapClick}>Perim Sweep</button>
            <PopoverItem />
        </div>
    )
}


const mapStateToProps = state => {
    return {
        firstDroneData: state.firstDrone
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendDroneFlyBy: () => dispatch(sendDroneFlyBy())
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(HomeToolbar)



