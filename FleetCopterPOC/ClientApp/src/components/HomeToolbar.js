import React , {useState} from 'react'
import axios from 'axios'
import logo from '../images/logo1.png';
import PopoverItem from './PopoverItem'


function HomeToolbar() {

    const [playerStatus,SetPlayerStatus] = useState(false)
    const handleFlyByClick = () => {
        axios.get('Ugcs/executeMission')
            .then(res => {
                console.log(res)
                if(res.data.Answer)
                    SetPlayerStatus(true)
            })
            .catch(err => {
                console.log(err)
            })
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
            <button className="buttonPanel-btn" onClick={handleFlyByClick}>FlyBy</button>
            <button className="buttonPanel-btn">Critical Holes</button>
            <button className="buttonPanel-btn">Perim Sweep</button>
            <PopoverItem />
        </div>
    )
}

export default HomeToolbar



