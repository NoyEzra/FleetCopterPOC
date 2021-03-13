import React, { useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo.png';
import { sendDroneMission, startConnection, isDroneAvailable, setError, deleteError, setAlertOn, setAlertOff, setFlyByState, setMarketingShotState, setCriticalHolesState, setPerimSweapState, activateDrone1, deactivateDrone1, activateDrone2, deactivateDrone2 } from '../redux';
import PopoverItem from './PopoverItem'
import { Alert } from '@material-ui/lab';


function HomeToolbar(props) {

    const containerRef = useRef();
    const { current } = containerRef;
    const flyByInterval = useRef();
    const marketingShotInterval = useRef();
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
        const vId = (props.flyBy == 1) ? props.activateDrone1 : props.activateDrone2;
        const isAvailable = props.isDroneAvailable(props.clientId, vId);
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

    //------------------------------MarketingShot--------------------------------
    const marketingShotCheck = () => {
        const vId = (props.marketingShot == 1) ? props.activateDrone1 : props.activateDrone2;
        const isAvailable = props.isDroneAvailable(props.clientId, vId);
        if (isAvailable) {
            props.setMarketingShotState(false);
        }
    }

    useEffect(() => {
        if (props.marketingShot) {
            marketingShotInterval.current = setInterval(marketingShotCheck, 1000);
        }
        else {
            clearInterval(marketingShotInterval.current);
        }
    }, [props.marketingShot])

    const handleMarketingShotClick = () => {
        props.sendDroneMission('MarketingShot', props.clientId, vehicleId)
    }

    //------------------------------CriticlHoles--------------------------------
    const criticalHolesCheck = () => {
        const vId = (props.criticalHoles == 1) ? props.activateDrone1 : props.activateDrone2;
        const isAvailable = props.isDroneAvailable(props.clientId, vId);
        if (isAvailable) {
            props.setCriticalHolesState(false);
        }
    }

    useEffect(() => {
        if (props.criticalHoles) {
            criticalHolesInterval.current = setInterval(criticalHolesCheck, 1000);
        }
        else {
            clearInterval(criticalHolesInterval.current);
        }
    }, [props.criticalHoles])

    const handleCriticalHoles = () => {
        console.log("inside critical holes click")
        if ((props.drone1Id != 0) && (props.drone2Id != 0)) {
            props.setError("There is currently no available drone")
        }
        else {
            var chosen = (props.drone1Id == 0) ? 1 : 2;
            console.log(chosen)
            console.log(props.droneData)
            for (var i = 0; i < props.droneData.droneDataArr.length; i++) {
                console.log(props.droneData.droneDataArr[i].vehicleId)
                if (props.droneData.droneDataArr[i].state == "stopState") {
                    if (chosen == 1)
                        props.activateDrone1(props.droneData.droneDataArr[i].vehicleId, "CriticalHoles", i);
                    else
                        props.activateDrone2(props.droneData.droneDataArr[i].vehicleId, "CriticalHoles", i);
                    props.sendDroneMission('CriticalHoles', props.clientId, props.droneData.droneDataArr[i].vehicleId)
                    break;
                }
            }
        }
    }

    //------------------------------PerimSweap--------------------------------
    const perimSweapCheck = () => {

        const vId = (props.perimSweapDrone == 1)? props.activateDrone1 : props.activateDrone2;
        const isAvailable = props.isDroneAvailable(props.clientId, vId); //send a req to server to see of perimSweapDrone using drone2idx is available!!
        if (isAvailable) {
            props.setPerimSweapState(false);
        }
    }

    useEffect(() => {
        console.log("perim sweap changed");
        console.log(props.perimSweap);
        if (props.perimSweap) {
            perimSweapInterval.current = setInterval(perimSweapCheck, 1000);
        }
        else {
            clearInterval(perimSweapInterval.current);
            if(props.perimSweapDrone == 1)
                props.deactivateDrone1();
            else
                props.deactivateDrone2();
        }
    }, [props.perimSweap])

    const handlePerimSweapClick = () => {
        console.log("inside perim sweep click")
        if((props.drone1Id != 0) && (props.drone2Id != 0)){
            props.setError("There is currently no available drone")
        }
        else{
            var chosen = (props.drone1Id == 0) ? 1 : 2;
            console.log(chosen)
            console.log(props.droneData)
            for (var i = 0; i < props.droneData.droneDataArr.length; i++){
                console.log(props.droneData.droneDataArr[i].vehicleId)
                if (props.droneData.droneDataArr[i].state == "stopState") {
                    if (chosen == 1)
                        props.activateDrone1(props.droneData.droneDataArr[i].vehicleId, "PerimSweap", i);
                    else
                        props.activateDrone2(props.droneData.droneDataArr[i].vehicleId, "PerimSweap", i);  
                    props.sendDroneMission('PerimSweap', props.clientId, props.droneData.droneDataArr[i].vehicleId)
                    break;
                }
            }
        }
    }

    //------------------------------HandleAlert------------------------------------
    useEffect(() => {
        if (props.error) {
            props.setAlertOn();
            setTimeout(() => {
                props.setAlertOff();
                props.deleteError();
            }, 5000);

        }
    }, [props.error])



    return (
        <div>
            <div className="buttonPanel">
                <img className="logo" src={logo} alt="Logo" />
                <button className="buttonPanel-btn">Fly To Point</button>
                <button className="buttonPanel-btn" onClick={handleMarketingShotClick} style={{ color: props.marketingShot ? '#ff751a' : 'white' }}>Marketing Shot</button>
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
        loading: state.clientData.loading,
        clientId: state.clientData.clientId,
        droneData: state.clientData.droneData,
        error: state.clientData.error,
        errMsg: state.clientData.errMsg,

        alertOn: state.alert.alertOn,

        flyBy: state.missionButtons.flyBy,
        flyByDrone: state.missionButtons.flyByDrone,
        marketingShot: state.missionButtons.MarketingShot,
        marketingShotDrone: state.missionButtons.marketingShotDrone,
        perimSweap: state.missionButtons.perimSweap,
        perimSweapDrone: state.missionButtons.perimSweapDrone,
        criticalHoles: state.missionButtons.criticalHoles,
        criticalHolesDrone: state.missionButtons.criticalHolesDrone,

        drone1Id: state.activeDrones.drone1Id,
        drone1Mission: state.activeDrones.drone1Mission,
        drone1Idx: state.activeDrones.drone1Idx,
        drone2Id: state.activeDrones.drone2Id,
        drone2Mission: state.activeDrones.drone2Mission,
        drone2Idx: state.activeDrones.drone2Idx

    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendDroneMission: (cId, vId, mission) => dispatch(sendDroneMission(cId, vId, mission)),
        startConnection: (cId) => dispatch(startConnection(cId)),
        isDroneAvailable: (clientId, vehicleId) => dispatch(isDroneAvailable(clientId, vehicleId)),
        setError: (errMsg) => dispatch(setError(errMsg)),
        deleteError: () => dispatch(deleteError()),

        setAlertOn: () => dispatch(setAlertOn()), 
        setAlertOff: () => dispatch(setAlertOff()),

        setFlyByState: (bState) => dispatch(setFlyByState(bState)),
        setMarketingShotState: (bState) => dispatch(setMarketingShotState(bState)),
        setPerimSweapState: (bState) => dispatch(setPerimSweapState(bState)),
        setCriticalHolesState: (bState) => dispatch(setCriticalHolesState(bState)),

        activateDrone1: (vid, mission) => dispatch(activateDrone1(vid, mission)),
        activateDrone2: (vid, mission) => dispatch(activateDrone2(vid, mission)),
        deactivateDrone1: () => dispatch(deactivateDrone1()),
        deactivateDrone2: () => dispatch(deactivateDrone2())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomeToolbar)



