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
    const [drone1Status, setDrone1Status] = useState({ status: "stand by", alt: 0, bat: 0, batteryPathColor: "#a6a6a6", droneTextClicked: false })
    const [drone2Status, setDrone2Status] = useState({ status: "stand by", alt: 0, bat: 0, batteryPathColor: "#a6a6a6", droneTextClicked: false })


    const updatePathColor = (bat) => {
        if (bat <= 20)
            return '#e60000';
        else if (bat <= 100)
            return '#4db8ff';
        else
            return '#a6a6a6';
    }


    const updateState = (state) => {
        if (state === "resumeState" || state === "pauseState") 
            return "airborne"
        else 
            return "stand by"
    }

    const fetchData = async () => {
        await props.updateDroneData(props.clientId);        
    }


    useEffect(() => {
        const ndrone1Alt = (props.droneData && props.droneData.droneDataArr && props.droneData.droneDataArr[0] && props.droneData.droneDataArr[0].altitudeAgl)
        const ndrone2Alt = (props.droneData && props.droneData.droneDataArr && props.droneData.droneDataArr[1] && props.droneData.droneDataArr[1].altitudeAgl)
        const ndrone1bat = (props.droneData && props.droneData.droneDataArr && props.droneData.droneDataArr[0] && props.droneData.droneDataArr[0].battery)
        const ndrone2bat = (props.droneData && props.droneData.droneDataArr && props.droneData.droneDataArr[1] && props.droneData.droneDataArr[1].battery)
        const ndrone1State = (props.droneData && props.droneData.droneDataArr && props.droneData.droneDataArr[0] && props.droneData.droneDataArr[0].state)
        const ndrone2State = (props.droneData && props.droneData.droneDataArr && props.droneData.droneDataArr[1] && props.droneData.droneDataArr[1].state)

        setDrone1Status({ ...drone1Status, status: updateState(ndrone1State), alt: ndrone1Alt, bat: ndrone1bat, batteryPathColor: updatePathColor(ndrone1bat) })
        setDrone2Status({ ...drone2Status, status: updateState(ndrone2State,), alt: ndrone2Alt, bat: ndrone2bat, batteryPathColor: updatePathColor(ndrone2bat)})
    }, [props.changed])

/*
    useEffect(() => {
        updateState(2);
        updatePathColor(2);
    }, [drone2Changed])
    */
    useEffect(() => {
        if (popoverOpen) {
            intervalRef.current = setInterval(fetchData, 1000)
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
                            <strong>altitude: {`${drone1Status.alt}`}</strong>
                        </div>
                        <div style={{ width: 80, height: 80 }}>
                            <CircularProgressbarWithChildren value={drone1Status.bat} styles={buildStyles({ strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6', pathColor: drone1Status.batteryPathColor, textColor: '#ffffff' })}>
                                <b style={{ fontSize: "20px" }}>{drone1Status.bat}%</b>
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
                            <strong>altitude: {`${drone2Status.alt}`}</strong>
                        </div>
                        <div style={{ width: 80, heights: 80 }}>
                            <CircularProgressbarWithChildren value={drone2Status.bat} styles={buildStyles({ strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6', pathColor: drone2Status.batteryPathColor, textColor: '#ffffff' })}>
                                <b style={{ fontSize: "20px" }}>{drone2Status.bat}%</b>
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
        clientId: state.firstDrone.clientId,
        droneData: state.firstDrone.droneData,
        error: state.firstDrone.error,
        errMsg: state.firstDrone.errMsg,
        changed: state.firstDrone.changed
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateDroneData: (cId) => dispatch(updateDroneData(cId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopoverItem)
