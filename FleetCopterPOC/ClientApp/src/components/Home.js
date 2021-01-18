import React, { Component, useState, useEffect, setInterval} from 'react';
import logo from '../images/logo1.png';
import background from '../images/background.png';
import navBackground from '../images/navBackground.png';
import { Button, Popover, PopoverHeader, PopoverBody, Text } from "reactstrap";
import { CircularProgressbar } from 'react-circular-progressbar';




export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = { percentage: 60, alt: "0", droneTextClicked: false };
        this.clickme = this.clickme.bind(this);
        this.PopoverItem = this.PopoverItem.bind(this);
        this.handleAltInterval = this.handleAltInterval.bind(this);
        this.startAltChange = this.startAltChange.bind(this);
        this.stopAltChange = this.stopAltChange.bind(this);
        this.fetchAlt = this.fetchAlt.bind(this);

    }

    async clickme() {
        const response = await fetch('Ugcs/executeMission');
        console.log("SUCCESS");
    }


   
    async fetchAlt() {
        const setAltState = (data) => {
            this.setState({ alt: data });
        };
        await fetch('Ugcs/vehicleAlt')
            .then((resp) => resp.json())
            .then(function (data) {
                console.log(data);
                setAltState(data);
            }); 
               
    }
   
    startAltChange = () => {
        this.intervalID = window.setInterval(this.fetchAlt.bind(this), 1000);
        this.setState({ droneTextClicked: true })
    }

    stopAltChange = () => {
        clearInterval(this.intervalID)
        this.setState({ droneTextClicked: false })
    }

    handleAltInterval = () => {
        if (this.state.droneTextClicked) {
            this.stopAltChange()
        } else {
            this.startAltChange()
        }
    }



    PopoverItem (props){
        const [popoverOpen, setPopoverOpen] = useState(false);
        const toggle = () => setPopoverOpen(!popoverOpen);

        return (
            <span>
                <Button
                    className="droneData-btn"
                    id="Popover"
                    type="button"
                    onClick={this.handleAltInterval}
                >
                    Drone
                </Button>
                <Popover
                    placement="buttom"
                    isOpen={popoverOpen}
                    target={"Popover"}
                    toggle={toggle}
                >
                    <PopoverBody style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', backgroundImage: 'url(' + navBackground + ')', backgroundSize: 'cover', color: 'white' }}>
                            <b>Drone1:</b>
                        <text>status:</text>
                        <script>{this.fetchData}</script>
                        <text>altitude:  {`${this.state.alt}`}</text>
                        <text>battery:  {`${60}%`}</text>
                        <CircularProgressbar value={60} text={`${60}% battery`} style={{ strokeLinecap: 'round', textSize: '16px', textColor: 'white', trailColor: 'white',}} />
                    </PopoverBody>
                </Popover>
            </span>
        );
    };


    render() {
        return (
            <div className="mainDiv">
                <div className="buttonPanel">
                    <img className="logo" src={logo} alt="Logo" />
                    <button className="buttonPanel-btn">Fly To Point</button>
                    <button className="buttonPanel-btn">Beauty Shot</button>
                    <button className="buttonPanel-btn" onClick={this.clickme}>FlyBy</button>
                    <button className="buttonPanel-btn">Critical Holes</button>
                    <button className="buttonPanel-btn">Perim Sweep</button>
                    <this.PopoverItem/>
                </div>
                <div className="backgroundDiv">
                    <img className="background" src={background} alt="Background"/>
                </div>
            </div>
        );
    }
}

