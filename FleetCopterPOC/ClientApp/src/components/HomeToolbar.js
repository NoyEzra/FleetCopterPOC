import React, { useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import logo from '../images/logo.png';
import { sendDroneMission, startConnection, isDroneAvailable, setAlertOn, setAlertOff, setFlyByState, setMarketingShotState, setCriticalHolesState, setPerimSweapState, activateDrone1, deactivateDrone1, activateDrone2, deactivateDrone2 } from '../redux';
import PopoverItem from './PopoverItem'
import { Alert } from '@material-ui/lab'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from 'reactstrap';
import { ContactSupportOutlined } from '@material-ui/icons';



function HomeToolbar(props) {

    const containerRef = useRef();
    const { current } = containerRef;
    const flyByInterval = useRef();
    const marketingShotInterval = useRef();
    const criticalHolesInterval = useRef();
    const perimSweapInterval = useRef();
    const [popupData, setPopupData] = useState({open: false, mission:''});


    useEffect(() => {
        props.startConnection(props.clientId);
    }, [current]);




    //-------------------------------BasicMissionExecution---------------------------------
    const handleMissionExecution = (chosen, vId, idx, mission) => {
        if (chosen == 1)
            props.activateDrone1(vId, mission, idx);
        else
            props.activateDrone2(vId, mission, idx);
        props.sendDroneMission(mission, props.clientId, vId, false);
    }

    const handleMissionClick = (mission) => {
        if ((props.drone1Id != 0) && (props.drone2Id != 0)) { //no available drone
            //props.setError("There is currently no available drone")
            if ((props.drone1Mission == mission) || (props.drone2Mission == mission)) { //one of the drone already perform the mission
                props.setAlertOn(true, `There is already a drone that performs ${mission} mission`);
            }
            else if ((props.drone1Mission == "PerimSweap") || (props.drone2Mission == "PerimSweap")) { //one of the drones perform perimSweap - automatically switch mission
                var chosen = (props.drone1Mission == "PerimSweap") ? 1 : 2;
                if (chosen == 1) {
                    handleMissionExecution(chosen, props.drone1Id, props.drone1Idx, mission);
                    props.setAlertOn(false, `Drone 1 mission changed from Perimeter Sweep to ${mission}`);
                }
                else{
                    handleMissionExecution(chosen, props.drone2Id, props.drone2Idx, mission);
                    props.setAlertOn(false, `Drone 2 mission changed from Perimeter Sweep to ${mission}`);
                }


                //TODO: check if the switch succeded
                props.setPerimSweapState(false);
            }
            else {//let the user decide using popup
                setPopupData({ open: true, mission: mission });
            }
        }
        else {
            var chosen = (props.drone1Id == 0) ? 1 : 2; // chosen = available drone
            for (var i = 0; i < props.droneData.droneDataArr.length; i++) {
                if (props.droneData.droneDataArr[i].state == "stopState") {
                    handleMissionExecution(chosen, props.droneData.droneDataArr[i].vehicleId, i, mission);
                    break;
                }
            }
        }
    }

    //-------------------------------FlyBy---------------------------------
    const flyByCheck = async () => {
        const vId = (props.flyBy == 1) ? props.activateDrone1 : props.activateDrone2;
        const isAvailable = await props.isDroneAvailable(props.clientId, vId);
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
            if (props.flyByDrone == 1 && props.drone1Mission == "FlyBy")//if the deactivation didnt happend due to mission switch
                props.deactivateDrone1();
            else if (props.flyByDrone == 2 && props.drone2Mission == "FlyBy")
                props.deactivateDrone2();
        }
    }, [props.flyBy])

    async function handleFlyByClick() {
        handleMissionClick("FlyBy");
    }

    //------------------------------MarketingShot--------------------------------
    const marketingShotCheck = async () => {
        const vId = (props.marketingShot == 1) ? props.activateDrone1 : props.activateDrone2;
        const isAvailable = await props.isDroneAvailable(props.clientId, vId);
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
            if (props.marketingShotDrone == 1 && props.drone1Mission == "MarketingShot")//if the deactivation didnt happend due to mission switch
                props.deactivateDrone1();
            else if (props.marketingShotDrone == 2 && props.drone2Mission == "MarketingShot")
                props.deactivateDrone2();
        }
    }, [props.marketingShot])

    const handleMarketingShotClick = () => {
        handleMissionClick("MarketingShot");
    }

    //------------------------------CriticlHoles--------------------------------
    const criticalHolesCheck = async () => {
        const vId = (props.criticalHoles == 1) ? props.activateDrone1 : props.activateDrone2;
        const isAvailable = await props.isDroneAvailable(props.clientId, vId);
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
            if (props.criticalHolesDrone == 1 && props.drone1Mission == "CriticalHoles")//if the deactivation didnt happend due to mission switch
                props.deactivateDrone1();
            else if (props.criticalHolesDrone == 2 && props.drone2Mission == "CriticalHoles")
                props.deactivateDrone2();
        }
    }, [props.criticalHoles])

    const handleCriticalHoles = () => {
        handleMissionClick("CriticalHoles");
    }

    //------------------------------PerimSweap--------------------------------
    const perimSweapCheck = async () => {

        const vId = (props.perimSweapDrone == 1)? props.activateDrone1 : props.activateDrone2;
        const isAvailable = await props.isDroneAvailable(props.clientId, vId); //send a req to server to see of perimSweapDrone using drone2idx is available!!
        if (isAvailable) {
            props.setPerimSweapState(false);
        }
    }

    useEffect(() => {
        if (props.perimSweap) {
            perimSweapInterval.current = setInterval(perimSweapCheck, 1000);
        }
        else {
            clearInterval(perimSweapInterval.current);
            if (props.perimSweapDrone == 1 && props.drone1Mission == "PerimSweap")//if the deactivation didnt happend due to mission switch
                props.deactivateDrone1();
            else if (props.perimSweapDrone == 2 && props.drone2Mission == "PerimSweap")
                props.deactivateDrone2();
        }
    }, [props.perimSweap])

    const handlePerimSweapClick = () => {
        handleMissionClick("PerimSweap");
    }


    //------------------------------HandlePopup------------------------------------ 
    const toggle = () => {
        setPopupData({open: !popupData.open, mission: ''});
    }

    const handlePopup = () => {
        const rbs = document.querySelectorAll('input[name="radio1"]');
        let selectedDrone;
        for(var i = 0; i < rbs.length; i++){
            let rb = rbs[i];
            if(rb.checked){
                selectedDrone = i + 1;
                break;
            }           
        }

        //the user didnt choose any option
        if(selectedDrone == undefined){
            toggle();
            return;
        }
         
        let prevMission;
        //activate drone again to change the mission and sent execute mission midflight request
        if (selectedDrone == 1) {
            prevMission = props.drone1Mission;
            props.activateDrone1(props.drone1Id, popupData.mission, props.drone1Idx);
            props.sendDroneMission(popupData.mission, props.clientId, props.drone1Id, true);
            

        }
        else {
            prevMission = props.drone2Mission;
            props.activateDrone2(props.drone2Id, popupData.mission, props.drone2Idx);
            props.sendDroneMission(props.clientId, props.drone2Id, popupData.mission, true);
        }

        //TODO: need to check first if the switch worked 
        switch (prevMission) {
            case "FlyBy":
                props.setFlyByState(false);
                break;
            case "MarketingShot":
                props.setMarketingShotState(false);
                break;
            case "CriticalHoles":
                props.setCriticalHolesState(false);
                break;
            case "PerimSweap":
                props.setPerimSweapState(false);
                break;
        }

        props.setAlertOn(false, `Drone ${selectedDrone} mission changed from ${prevMission} Sweep to ${popupData.mission}`);

        toggle();
    }


    //------------------------------HandleAlerts------------------------------------
    useEffect(() => {
        if (props.alertErrOn) {
            setTimeout(() => {
                props.setAlertOff(true);
            }, 5000);
        }
    }, [props.alertErrOn])

    useEffect(() => {
        if (props.alertInfOn) {
            setTimeout(() => {
                props.setAlertOff(false);
            }, 5000);
        }
    }, [props.alertInfOn])

    //----------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------
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
            {props.alertErrOn &&
                <Alert severity="error" style={{ color: 'black' }}>{`${props.errMsg}`}</Alert>
            }
            {props.alertInfOn &&
                <Alert severity="info" style={{ color: 'black' }}>{`${props.infMsg}`}</Alert>
            }
            <Modal isOpen={popupData.open} toggle={toggle}>
                <ModalHeader toggle={toggle}>There is currently no available drone</ModalHeader>
                <ModalBody>
                    If you would like to change one of the drone's mission please select youre choise and press OK.
                    <p>&nbsp;</p> 
                  <FormGroup tag="fieldset">
                        <FormGroup check>
                            <Input id="radio1-option1" type="radio" name="radio1"/>
                            <Label check for="radio1-option1">
                                Stop drone 1 {`${props.drone1Mission}`} mission
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Input id="radio1-option2" type="radio" name="radio1"/>
                            <Label check for="radio1-option2">
                                Stop drone 2 {`${props.drone2Mission}`} mission
                            </Label>
                        </FormGroup>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <button onClick={handlePopup} style={{ backgroundColor: '#004466', color: 'white'}}>OK</button>{' '}
                </ModalFooter>
            </Modal>
        </div>
    )
}


const mapStateToProps = state => {
    return {
        loading: state.clientData.loading,
        clientId: state.clientData.clientId,
        droneData: state.clientData.droneData,

        alertErrOn: state.alert.alertErrOn,
        errMsg: state.alert.errMsg,
        alertInfOn: state.alert.alertInfOn,
        infMsg: state.alert.infMsg,
            
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
        sendDroneMission: (cId, vId, mission, midflight) => dispatch(sendDroneMission(cId, vId, mission, midflight)),
        startConnection: (cId) => dispatch(startConnection(cId)),
        isDroneAvailable: (clientId, vehicleId) => dispatch(isDroneAvailable(clientId, vehicleId)),

        setAlertOn: (err, msg) => dispatch(setAlertOn(err, msg)), 
        setAlertOff: (err) => dispatch(setAlertOff(err)),

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



