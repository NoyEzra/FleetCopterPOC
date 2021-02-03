import React , {useState} from 'react'
import axios from 'axios'
import logo from '../images/logo1.png';
import PopoverItem from './PopoverItem'


function HomeToolbar() {

    const [playerStatus,SetPlayerStatus] = useState(false)
    const [FlyByColor,SetFlyByColor] = useState("#ffffff")
    

    const handleFlyByClick = () => {
        SetFlyByColor("#ff8533");
        axios.get('Ugcs/executeMission')
            .then(res => {
                console.log(res)
                if(res.data.Answer)
                    SetPlayerStatus(true)
            })
            .catch(err => {
                console.log(err)
            })
        SetFlyByColor("#ffffff");
    }

    /*
    const handleFlyByClick = async () => {
        const response = await fetch('Ugcs/executeMission')
        console.log("SUCCESS")
        console.log(response)
    }
    */

    return (
        <div className="buttonPanel">
            <img className="logo" src={logo} alt="Logo" />
            <button className="buttonPanel-btn">Fly To Point</button>
            <button className="buttonPanel-btn">Beauty Shot</button>
            <button id="buttonPanel-btn" className="buttonPanel-btn" onClick={handleFlyByClick} style={{color:FlyByColor}}>FlyBy</button>
            <button className="buttonPanel-btn">Critical Holes</button>
            <button className="buttonPanel-btn">Perim Sweep</button>
            <PopoverItem />
        </div>
    )
}

export default HomeToolbar



