import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useRef, Text} from 'react'
import navBackground from '../images/navBackground.png';
import { Button, Popover, PopoverHeader, PopoverBody} from "reactstrap";
import { CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function PopoverItem() {
    
    const [droneStatus, setDroneStatus] = useState({status: "airborne", percentage: 60, alt: "0", droneTextClicked: false })
    const [popoverOpen, setPopoverOpen] = useState(false)
    const intervalRef = useRef()
    const toggle = () => setPopoverOpen(!popoverOpen)

    const fetchAlt = async () => {
        const setAltState = (data) => {
            setDroneStatus({...droneStatus, alt: data})
        };
        await fetch('Ugcs/vehicleAlt')
            .then((resp) => resp.json())
            .then(function (data) {
                console.log(data);
                setAltState(data);
            }); 
               
    }

    useEffect(() => {
        if(popoverOpen){
            intervalRef.current = setInterval(fetchAlt,1000)
            setDroneStatus({...droneStatus, droneTextClicked: true})
            
        }
        //console.log("popover")
        return () => {
            clearInterval(intervalRef.current)
            setDroneStatus({...droneStatus, droneTextClicked: false})
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
        if (droneStatus.droneTextClicked) {//if(!popoverOpen)
            clearInterval(intervalRef.current)
            setDroneStatus({...droneStatus, droneTextClicked: false})
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
                        <text>status: {`${droneStatus.status}`}</text>
                        <text>altitude: {`${droneStatus.alt}`}</text>
                    </div>
                    <div style={{ width: 80, height: 80 }}>
                        <CircularProgressbar value={60} text={`${60}% battery`} styles={buildStyles({strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6',pathColor: '#4db8ff', textColor: '#ffffff'})} />
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
                        <text>status:</text>
                        <text>altitude: {`${droneStatus.alt}`}</text>
                    </div>
                    <div style={{ width: 80, height: 80 }}>
                        <CircularProgressbar value={60} text={`${60}% battery`} styles={buildStyles({strokeLinecap: 'butt', textSize: '14px', trailColor: '#a6a6a6', pathColor: '#4db8ff', textColor: '#ffffff'})} />
                    </div>
                </PopoverBody>
            </div>
            </Popover>
            </span>
    )
    
}

export default PopoverItem

