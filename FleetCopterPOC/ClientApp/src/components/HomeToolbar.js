import React , {useState} from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo1.png';
import { sendDroneFlyBy } from '../redux';
import PopoverItem from './PopoverItem'


function HomeToolbar( { firstDroneData, sendDroneFlyBy }) {

    const [playerStatus,SetPlayerStatus] = useState(false)

    const handleFlyByClick = () => {
        sendDroneFlyBy()
        firstDroneData.loading ? 
        (console.log('loading FlyBy')) :
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
            <button className="buttonPanel-btn">Beauty Shot</button>
            <button className="buttonPanel-btn" onClick={handleFlyByClick}>FlyBy</button>
            <button className="buttonPanel-btn">Critical Holes</button>
            <button className="buttonPanel-btn">Perim Sweep</button>
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



