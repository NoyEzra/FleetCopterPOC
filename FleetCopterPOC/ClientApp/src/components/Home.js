import React, { Component, useState } from 'react';
import logo from '../images/logo1.png';
import background from '../images/background.png';
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";



export class Home extends Component {
    static displayName = Home.name;
    constructor(props) {
        super(props);
        this.state = { currentCount: 0 };
        this.clickme = this.clickme.bind(this);
        this.PopoverItem = this.PopoverItem.bind(this);
    }
    async clickme() {
        const response = await fetch('Ugcs/executeMission');
        console.log("SUCCESS");
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
                >
                    Drone
                </Button>
                <Popover
                    placement="buttom"
                    isOpen={popoverOpen}
                    target={"Popover"}
                    toggle={toggle}
                >
                    <PopoverBody>
                        Sed posuere consectetur est at lobortis. Aenean eu leo quam.
                        Pellentesque ornare sem lacinia quam venenatis vestibulum.
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
                <img className="background" src={background} alt="Background"/>
            </div>
        );
    }
}

