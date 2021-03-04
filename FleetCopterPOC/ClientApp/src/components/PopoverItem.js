import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react'
import navBackground from '../images/navBackground.png';
import { Popover, PopoverBody } from "reactstrap";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { connect } from 'react-redux'
import { updateDroneData } from '../redux'

function PopoverItem(props) {

    
    const [popoverOpen, setPopoverOpen] = useState(false)
    const intervalRef = useRef()
    const toggle = () => setPopoverOpen(!popoverOpen)

    const [drone1Changed, setDrone1Changed] = useState(false)
    const [drone2Changed, setDrone2Changed] = useState(false)

    const clientId = (props.droneData && props.droneData.clientId)

    const drone1Alt = (props.droneData &&
        props.droneData.droneDataArr &&
        props.droneData.droneDataArr[0] &&
        props.droneData.droneDataArr[0].altitudeAgl)

    const drone2Alt = (props.droneData &&
        props.droneData.droneDataArr &&
        props.droneData.droneDataArr[1] &&
        props.droneData.droneDataArr[1].altitudeAgl)

    const drone1bat = (props.droneData &&
        props.droneData.droneDataArr &&
        props.droneData.droneDataArr[0] &&
        props.droneData.droneDataArr[0].battery)

    const drone2bat = (props.droneData &&
        props.droneData.droneDataArr &&
        props.droneData.droneDataArr[1] &&
        props.droneData.droneDataArr[1].battery)

    const drone1State = (props.droneData &&
        props.droneData.droneDataArr &&
        props.droneData.droneDataArr[0] &&
        props.droneData.droneDataArr[0].state)

    const drone2State = (props.droneData &&
        props.droneData.droneDataArr &&
        props.droneData.droneDataArr[1] &&
        props.droneData.droneDataArr[1].state)


    const [drone1Status, setDrone1Status] = useState({ status: (drone1State === "resumeState" || drone1State === "pauseState")?"airborne":"stand by", batteryPathColor: (drone1bat <= 20) ? '#4db8ff' : (drone1bat <= 100) ? '#e60000' : "#a6a6a6", droneTextClicked: false, changed: false })
    const [drone2Status, setDrone2Status] = useState({ status: (drone1State === "resumeState" || drone1State === "pauseState") ? "airborne" : "stand by", batteryPathColor: "#a6a6a6", droneTextClicked: false, changed: false })
    
    const updatePathColor = (dronenum) => {
        if (dronenum === 1) {
            if (drone1bat <= 20) { setDrone1Status({ ...drone1Status, batteryPathColor: '#e60000'})
        }
            else if (drone1bat <= 100) { setDrone1Status({ ...drone1Status, batteryPathColor: '#4db8ff' }) }
            else { setDrone1Status({ ...drone1Status, batteryPathColor: '#a6a6a6' }) }
        }
        else if (dronenum === 2) {
            if (drone2bat <= 20) { setDrone2Status({ ...drone2Status, batteryPathColor: '#e60000' }) }
            else if (drone2bat <= 100) { setDrone2Status({ ...drone2Status, batteryPathColor: '#4db8ff' }) }
            else { setDrone2Status({ ...drone2Status, batteryPathColor: '#a6a6a6' }) }

        }
    }
    const updateState = (dronenum) => {
        if (dronenum === 1) {
            if (drone1State === "resumeState" || drone1State === "pauseState") { setDrone1Status({ ...drone1Status, status: "airborne" })}
            else { setDrone1Status({ ...drone1Status, status: "stand by" }) }
        }
        else if (dronenum === 2) {
            if (drone2State === "resumeState" || drone2State === "pauseState") { setDrone2Status({ ...drone2Status, status: "airborne" }) }
            else { setDrone2Status({ ...drone2Status, status: "stand by" }) }
        }
    }
    
    const fetchAlt = async () => {
        await props.updateDroneData(props.droneData.clientId);
        setDrone1Changed(!drone1Changed);
        setDrone2Changed(!drone2Changed);
    }

    
    //update drones telemetry when new drone data has been fetched frome the server
    useEffect(() => {
        updateState(1);
        updatePathColor(1);
    }, [drone1Changed])

    useEffect(() => {
        updateState(2);
        updatePathColor(2);
    }, [drone2Changed])
    
    useEffect(() => {
        if (popoverOpen) {
            intervalRef.current = setInterval(fetchAlt, 1000)
            setDrone1Status({ ...drone1Status, droneTextClicked: true })
            setDrone2Status({ ...drone2Status, droneTextClicked: true })
        }
        return () => {
            clearInterval(intervalRef.current)
            setDrone1Status({ ...drone1Status, droneTextClicked: false })
            setDrone2Status({ ...drone2Status, droneTextClicked: false })
        }
    }, [popoverOpen])

    const handleAltInterval = () => {
        props.updateDroneData(props.droneData.clientId)
        setDrone1Changed(!drone1Changed);
        setDrone2Changed(!drone2Changed);
        if (drone1Status.droneTextClicked) {//if(!popoverOpen)
            clearInterval(intervalRef.current)
            setDrone1Status({ ...drone1Status, droneTextClicked: false })
            setDrone2Status({ ...drone2Status, droneTextClicked: false })
        }
    }

    return (
        <span>

            <button
                className="droneData-btn"
                id="Popover"
                type="button"
                onClick={handleAltInterval}
            >
                Drone
            </button>
            <Popover
                placement="bottom"
                isOpen={popoverOpen}
                target={"Popover"}
                toggle={toggle}
            >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <PopoverBody style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        backgroundImage: 'url(' + navBackground + ')',
                        backgroundSize: 'cover',
                        color: 'white'
                    }}>
                        <b style={{ marginBottom: "10px" }}> Drone 1:</b>
                        <div style={{ textAlign: "left", marginBottom: "10px", display: 'flex', flexDirection: 'column' }}>
                            <strong>status: {`${drone1Status.status}`}</strong>
                            <strong>altitude: {`${drone1Alt}`}</strong>
                        </div>
                        <div style={{ width: 80, height: 80 }}>
                            <CircularProgressbarWithChildren value={drone1bat} styles={buildStyles({ strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6', pathColor: drone1Status.batteryPathColor, textColor: '#ffffff' })}>
                                <b style={{ fontSize: "20px" }}>{drone1bat}%</b>
                                <strong>Battery</strong>
                            </CircularProgressbarWithChildren>
                        </div>
                    </PopoverBody>
                    <PopoverBody style={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        backgroundImage: 'url(' + navBackground + ')',
                        backgroundSize: 'cover',
                        color: 'white'
                    }}>
                        <b style={{ marginBottom: "10px" }}>Drone 2:</b>
                        <div style={{ textAlign: "left", marginBottom: "10px", display: 'flex', flexDirection: 'column' }}>
                            <strong>status: {`${drone2Status.status}`}</strong>
                            <strong>altitude: {`${drone2Alt}`}</strong>
                        </div>
                        <div style={{ width: 80, heights : 80 }}>
                            <CircularProgressbarWithChildren value={drone2bat} styles={buildStyles({ strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6', pathColor: drone2Status.batteryPathColor, textColor: '#ffffff' })}>
                                <b style={{ fontSize: "20px" }}>{drone2bat}%</b>
                                <strong>Battery</strong>
                            </CircularProgressbarWithChildren>
                        </div>
                    </PopoverBody>
                </div>
            </Popover>
        </span>
    )

}

const mapStateToProps = state => {
    return {
        loading: state.firstDrone.loading,
        droneData: state.firstDrone.droneData,
        error: state.firstDrone.error,
        errMsg: state.firstDrone.errMsg
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateDroneData: (cId) => dispatch(updateDroneData(cId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopoverItem)

