import React, { useState, useEffect} from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo1.png';
import { sendDroneMission, setAlertOn, setAlertOff } from '../redux';
import PopoverItem from './PopoverItem'
import { Alert } from '@material-ui/lab';


function HomeToolbar(props) {

    const [playerStatus,SetPlayerStatus] = useState(false)
    const clientId = (props.droneData && props.droneData.clientId)

    const vehicleId = (props.droneData &&
        props.droneData.droneDataArr && 
        props.droneData.droneDataArr[1] && 
        props.droneData.droneDataArr[1].vehicleId)

    const vehicleState = (props.droneData &&
           props.droneData.droneDataArr && 
           props.droneData.droneDataArr[1] && 
           props.droneData.droneDataArr[1].state)

    const errorState = (props.error)


    

    const handleFlyByClick = () => {
        props.sendDroneMission('FlyBy', clientId, vehicleId)  
    }

    const handleBeautyShotClick = () => {
        props.sendDroneMission('BeautyShot', clientId, vehicleId)
    }

    const handleCriticalHoles = () => {
        props.sendDroneMission('CriticalHoles', clientId, vehicleId)
    }

    const handlePerimSweapClick = () => {
        props.sendDroneMission('PerimSweap', clientId, vehicleId)
    }

    useEffect(() => {
        if (props.error) {
            console.log(props.errorMsg);
            props.setAlertOn();
            setTimeout(() => {
                props.setAlertOff();
            }, 5000);
        }
    }, [props.error])



    return (
        <div>
            <div className="buttonPanel">
                <img className="logo" src={logo} alt="Logo" />
                <button className="buttonPanel-btn">Fly To Point</button>
                <button className="buttonPanel-btn" onClick={handleBeautyShotClick}>Beauty Shot</button>
                <button className="buttonPanel-btn" onClick={handleFlyByClick}>FlyBy</button>
                <button className="buttonPanel-btn" onClick={handleCriticalHoles}>Critical Holes</button>
                <button className="buttonPanel-btn" onClick={handlePerimSweapClick}>Perim Sweep</button>
                <PopoverItem />
            </div>
            {props.alertOn &&
                <Alert severity="error">{props.errMsg}</Alert>

            }
        </div>
    )
}


const mapStateToProps = state => {
    return {
        loading: state.firstDrone.loading,
        droneData: state.firstDrone.droneData,
        error: state.firstDrone.error,
        errMsg: state.firstDrone.errMsg,
        alertOn: state.alert.alertOn
      }
}

const mapDispatchToProps = dispatch => {
    return {
        sendDroneMission: (cId, vId, mission) => dispatch(sendDroneMission(cId, vId, mission)),
        setAlertOn: () => dispatch(setAlertOn()), 
        setAlertOff: () => dispatch(setAlertOff())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomeToolbar)



