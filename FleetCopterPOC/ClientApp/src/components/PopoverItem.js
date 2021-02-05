import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useRef, Text} from 'react'
import navBackground from '../images/navBackground.png';
import { Button, Popover, PopoverHeader, PopoverBody} from "reactstrap";
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function PopoverItem() {
    
    const [drone1Status, setDrone1Status] = useState({ status: "stand by", battery: 10, batteryPathColor: "#4db8ff", alt: "0", droneTextClicked: false })
    const [drone2Status, setDrone2Status] = useState({ status: "stand by", battery: 20, batteryPathColor: "#4db8ff", alt: "0", droneTextClicked: false })
    const [popoverOpen, setPopoverOpen] = useState(false)
    const intervalRef = useRef()
    const toggle = () => setPopoverOpen(!popoverOpen)

    const fetchAlt = async () => {
        const setBatState = (data, numDrone) => {
            if (numDrone == 1) {
                if(data > 10){
                    setDrone1Status({ ...drone1Status, battery: data , batteryPathColor: "#4db8ff"});
                }
                else{
                    setDrone1Status({ ...drone1Status, battery: data, batteryPathColor: "#e60000"})
                }
            }
            else {
                if(data > 10){
                    setDrone2Status({ ...drone2Status, battery: data, batteryPathColor: "#4db8ff"})
                }
                else{
                    setDrone2Status({ ...drone2Status, battery: data, batteryPathColor: "#e60000"})
                }
            }
        };

        const setAltState = (data, numDrone) => {
            if (numDrone == 1) {
                if (data > 0) {
                    setDrone1Status({ ...drone1Status, status: "airborne", alt: data })
                }
                else {
                    setDrone1Status({ ...drone1Status, status: "stand by", alt: data })
                }
            }
            else {
                if (data > 0) {
                    setDrone2Status({ ...drone2Status, status: "airborne", alt: data })
                }
                else {
                    setDrone2Status({ ...drone2Status, status: "stand by", alt: data })
                }
            }
  
        
        };

        await fetch('Ugcs/vehicleAlt')
            .then((resp) => resp.json())
            .then(function (data) {
                console.log(data);
                setAltState(data.drone1Alt, 1);
                setAltState(data.drone2Alt, 2);
                setBatState(data.drone1Bat, 1);
                setBatState(data.drone2Bat, 2);
            }); 


               
    }

    useEffect(() => {
        if(popoverOpen){
            intervalRef.current = setInterval(fetchAlt,1000)
            setDrone1Status({...drone1Status, droneTextClicked: true})
            setDrone2Status({ ...drone2Status, droneTextClicked: true })
        }
        //console.log("popover")
        return () => {
            clearInterval(intervalRef.current)
            setDrone1Status({ ...drone1Status, droneTextClicked: false })
            setDrone2Status({ ...drone2Status, droneTextClicked: false })
        }
    }, [popoverOpen])

    /*
    const startAltChange = () => {
        this.intervalID = window.setInterval(this.fetchAlt.bind(this), 1000);
        setDroneStatus({...droneStatus, droneTextClicked: true})
    }

    const stopAltChange = () => {
        clearInterval(this.intervalID)
        setDroneStatus({...droneStatus, droneTextClicked: false})
    }
    */

    const handleAltInterval = () => {
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
            <div style={{display:'flex',flexDirection:'row'}}>
                <PopoverBody style={{ display: 'flex', 
                                    flexDirection: 'column', 
                                    textAlign: 'center', 
                                    backgroundImage: 'url(' + navBackground + ')', 
                                    backgroundSize: 'cover', 
                                    color: 'white' }}>
                    <b style={{marginBottom:"10px"}}> Drone 1:</b>
                    <div style={{textAlign:"left", marginBottom:"10px", display:'flex',flexDirection:'column'}}>
                        <text>status: {`${drone1Status.status}`}</text>
                        <text>altitude: {`${drone1Status.alt}`}</text>
                    </div>
                    <div style={{ width: 80, height: 80 }}>
                            <CircularProgressbarWithChildren value={drone1Status.battery} styles={buildStyles({ strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6', pathColor: drone1Status.batteryPathColor, textColor: '#ffffff' })}>
                                <b style={{fontSize:"20px"}}>{drone1Status.battery}%</b>
                                <text>Battery</text>
                            </CircularProgressbarWithChildren>
                    </div>
                </PopoverBody>
                <PopoverBody style={{ display: 'flex', 
                                    flexDirection: 'column', 
                                    textAlign: 'center', 
                                    backgroundImage: 'url(' + navBackground + ')', 
                                    backgroundSize: 'cover', 
                                    color: 'white' }}>
                    <b style={{marginBottom:"10px"}}>Drone 2:</b>
                    <div style={{textAlign:"left", marginBottom:"10px", display:'flex',flexDirection:'column'}}>
                        <text>status: {`${drone2Status.status}`}</text>
                        <text>altitude: {`${drone2Status.alt}`}</text>
                    </div>
                    <div style={{ width: 80, height: 80 }}>
                            <CircularProgressbarWithChildren value={drone2Status.battery} styles={buildStyles({strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6', pathColor: drone2Status.batteryPathColor, textColor: '#ffffff'})}>
                                    <b style={{fontSize:"20px"}}>{drone2Status.battery}%</b>
                                    <text>Battery</text>
                            </CircularProgressbarWithChildren>
                    </div>
                </PopoverBody>
            </div>
            </Popover>
            </span>
    )
    
}

export default PopoverItem

