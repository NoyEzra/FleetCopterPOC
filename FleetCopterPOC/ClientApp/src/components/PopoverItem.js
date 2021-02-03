import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useRef} from 'react'
import navBackground from '../images/navBackground.png';
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { CircularProgressbar } from 'react-circular-progressbar';

function PopoverItem() {
    
    const [droneStatus, setDroneStatus] = useState({percentage: 60, alt: "0", droneTextClicked: false })
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
                <PopoverBody style={{ display: 'flex', 
                                    flexDirection: 'column', 
                                    textAlign: 'center', 
                                    backgroundImage: 'url(' + navBackground + ')', 
                                    backgroundSize: 'cover', 
                                    color: 'white' }}>
                    <b>Drone1:</b>
                    <text>status:</text>
                    <text>altitude:  {`${droneStatus.alt}`}</text>
                    <text>battery:  {`${droneStatus.percentage}%`}</text>
                    <CircularProgressbar value={60} text={`${60}% battery`} style={{ strokeLinecap: 'round', textSize: '16px', textColor: 'white', trailColor: 'white',}} />
                </PopoverBody>
            </Popover>
            </span>
    )
    
}

export default PopoverItem

