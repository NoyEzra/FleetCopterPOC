import React, { useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo.png';
import { sendDroneMission, startConnection, setAlertOn, setAlertOff, setFlyByState, setBeautyShotState, setCriticalHolesState, setPerimSweapState } from '../redux';
import PopoverItem from './PopoverItem'
import { Alert } from '@material-ui/lab';


function HomeToolbar(props) {

    const containerRef = useRef();
    const { current } = containerRef;
    const flyByInterval = useRef();
    const beautyShotInterval = useRef();
    const criticalHolesInterval = useRef();
    const perimSweapInterval = useRef();


   
   

    useEffect(() => {
        props.startConnection(props.clientId);
    }, [current]);


    const vehicleId = (props.droneData &&
        props.droneData.droneDataArr && 
        props.droneData.droneDataArr[1] && 
        props.droneData.droneDataArr[1].vehicleId)


    //-------------------------------FlyBy---------------------------------
    const flyByCheck = () => {
        const isAvailable = false;
        if (isAvailable) {
            props.setFlyByState(false);
        }
    }

    useEffect(() => {
        if (props.flyBy) {
            flyByInterval.current = setInterval(flyByCheck, 1000);
        }
        else{
            clearInterval(flyByInterval.current);
        }
    }, [props.flyBy])

    async function handleFlyByClick() {
        props.sendDroneMission('FlyBy', props.clientId, vehicleId);
    }

    //------------------------------BeautyShot--------------------------------
    const beautyShotCheck = () => {
        const isAvailable = false;
        if (isAvailable) {
            props.setBeautyShotState(false);
        }
    }

    useEffect(() => {
        if (props.flyBy) {
            beautyShotInterval.current = setInterval(beautyShotCheck, 1000);
        }
        else {
            clearInterval(beautyShotInterval.current);
        }
    }, [props.beautyShot])

    const handleBeautyShotClick = () => {
        props.sendDroneMission('BeautyShot', props.clientId, vehicleId)
    }

    //------------------------------CriticlHoles--------------------------------
    const criticalHolesCheck = () => {
        const isAvailable = false;
        if (isAvailable) {
            props.setCriticalHolesState(false);
        }
    }

    useEffect(() => {
        if (props.flyBy) {
            criticalHolesInterval.current = setInterval(criticalHolesCheck, 1000);
        }
        else {
            clearInterval(criticalHolesInterval.current);
        }
    }, [props.criticalHoles])

    const handleCriticalHoles = () => {
        props.sendDroneMission('CriticalHoles', props.clientId, vehicleId)
    }

    //------------------------------PerimSweap--------------------------------
    const perimSweapCheck = () => {
        const isAvailable = false;
        if (isAvailable) {
            props.setPerimSweapState(false);
        }
    }

    useEffect(() => {
        if (props.flyBy) {
            perimSweapInterval.current = setInterval(perimSweapCheck, 1000);
        }
        else {
            clearInterval(perimSweapInterval.current);
        }
    }, [props.perimSweap])

    const handlePerimSweapClick = () => {
        props.sendDroneMission('PerimSweap', props.clientId, vehicleId)
    }

    //------------------------------HandleAlert------------------------------------
    useEffect(() => {
        if (props.error) {
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
                <button className="buttonPanel-btn" onClick={handleBeautyShotClick} style={{ color: props.beautyShot ? '#ff751a' : 'white' }}>Marketing Shot</button>
                <button className="buttonPanel-btn" onClick={handleFlyByClick} style={{ color: props.flyBy ? '#ff751a' : 'white' }}>FlyBy</button>
                <button className="buttonPanel-btn" onClick={handleCriticalHoles} style={{ color: props.criticalHoles ? '#ff751a' : 'white' }}>Critical Hole Shots</button>
                <button className="buttonPanel-btn" onClick={handlePerimSweapClick} style={{ color: props.perimSweap ? '#ff751a' : 'white' }}>Perimeter Sweep</button>
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
        clientId: state.firstDrone.clientId,
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



