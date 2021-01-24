import React from 'react'
import axios from 'axios'
import logo from '../images/logo1.png';
import PopoverItem from './PopoverItem'

function HomeToolbar() {


    /*const handleFlyByClick = () =>{
        axios.get('Ugcs/executeMission')
        console.log("SUCCESS");
    }
    */
    const handleFlyByClick = async () => {
    const response = await fetch('Ugcs/executeMission')
    console.log("SUCCESS")
    }


    return (
        <div className="buttonPanel">
            <img className="logo" src={logo} alt="Logo" />
            <button className="buttonPanel-btn">Fly To Point</button>
            <button className="buttonPanel-btn">Beauty Shot</button>
            <button className="buttonPanel-btn" onClick={handleFlyByClick}>FlyBy</button>
            <button className="buttonPanel-btn">Critical Holes</button>
            <button className="buttonPanel-btn">Perim Sweep</button>
            <PopoverItem />
        </div>
    )
}

export default HomeToolbar



