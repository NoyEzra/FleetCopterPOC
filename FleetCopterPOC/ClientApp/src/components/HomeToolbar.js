import React, { useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo.png';
import { sendDroneMission, startConnection, setAlertOn, setAlertOff, setFlyByState, setBeautyShotState, setCriticalHolesState, setPerimSweapState } from '../redux';
import PopoverItem from './PopoverItem'
import { Alert } from '@material-ui/lab';


function HomeToolbar(props) {

    const containerRef = useRef();
    const intervalRef = useRef();
    const { current } = containerRef;



    useEffect(() => {
        props.startConnection(clientId);
        console.log(props.droneData);
    }, [current]);

    const clientId = (props.droneData && props.droneData.clientId)

    const vehicleId = (props.droneData &&
        props.droneData.droneDataArr && 
        props.droneData.droneDataArr[1] && 
        props.droneData.droneDataArr[1].vehicleId)


    const isDroneAvailable = () => {
        console.log("inside isDroneAvailable");
        const isAvailable = false;
        if (isAvailable) {
            props.setFlyByState(false);
        }
    }

    const handleInterval = () => {
        console.log("inside handle interval");
        intervalRef.current = setInterval(isDroneAvailable, 1000)
    }

    useEffect(() => {
        if (props.flyBy) {
            handleInterval();
        }
        else{
            clearInterval(intervalRef.current);
        }
    }, [props.flyBy])

    async function handleFlyByClick() {
        props.sendDroneMission('FlyBy', props.droneData.clientId, vehicleId);
    }
    /*
    const handleFlyByClick = async () => {
        const success = await props.sendDroneMission('FlyBy', props.droneData.clientId, vehicleId) 
        console.log("inside handle flyby click ");
        console.log(success);
        if (success) {
            console.log("inside handle flyby click success");
            setFlyByClicked(true)
            handleInterval();
        }
    }*/

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
                <button className="buttonPanel-btn" onClick={handleFlyByClick} style={{ color: props.flyBy ? '#ff751a' :'white' }}>FlyBy</button>
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
        alertOn: state.alert.alertOn,
        flyBy: state.missionButtons.flyBy,
        beautyShot: state.missionButtons.beautyShot,
        perimSweap: state.missionButtons.perimSweap,
        criticalHoles: state.missionButtons.criticalHoles,
      }
}

const mapDispatchToProps = dispatch => {
    return {
        sendDroneMission: (cId, vId, mission) => dispatch(sendDroneMission(cId, vId, mission)),
        startConnection: (cId) => dispatch(startConnection(cId)),
        setAlertOn: () => dispatch(setAlertOn()), 
        setAlertOff: () => dispatch(setAlertOff()),
        setFlyByState: (bState) => dispatch(setFlyByState(bState)),
        setBeautyShotState: (bState) => dispatch(setBeautyShotState(bState)),
        setPerimSweapState: (bState) => dispatch(setPerimSweapState(bState)),
        setCriticalHolesState: (bState) => dispatch(setCriticalHolesState(bState))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomeToolbar)



