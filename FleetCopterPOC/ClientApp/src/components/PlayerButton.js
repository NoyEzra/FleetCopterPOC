import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
//import 'mdbreact/dist/css/mdb.css';
import React, { useState,useEffect } from "react";
//import { MDBBtn, MDBIcon } from "mdbreact";
import { connect } from 'react-redux'
import { sendDronePause, sendDroneResume, sendDroneReturnHome } from '../redux'
import pauseIcon from '../images/pause_icon.png';
import playIcon from '../images/play_icon.png';
import stopIcon from '../images/stop_icon.png';



function PlayerButton(props) {
    const [playerButton,setPlayerButton] = useState(true)
    const vehicleId = (props.droneData &&
                       props.droneData.droneDataArr && 
                       props.droneData.droneDataArr[1] && 
                       props.droneData.droneDataArr[1].vehicleId)

    const vehicleState = (props.droneData &&
                          props.droneData.droneDataArr && 
                          props.droneData.droneDataArr[1] && 
                          props.droneData.droneDataArr[1].state)

    const isOnFlight = ((vehicleState === 'pauseState') || (vehicleState === 'resumeState'))                     

      //1)need to check and handle props.error?    !!!!!!!!!!!
      //2)keep tracking drone while returns home, when it get home -> drone became disabled.
      //   until then pause and resume should be available.
    useEffect(() => {
        console.log("vehicle state changed");
        console.log(vehicleState);
        console.log(props.droneData);
      if(vehicleState === 'pauseState'){
        setPlayerButton(true)
      }//pause button pressed => change to play button 
      else if(vehicleState === 'resumeState'){
        setPlayerButton(false)
      } //play button pressed => change to pause button
      else {
        setPlayerButton(true)
      } //stop button pressed => change to play button (disabled)
    }, [vehicleState])

    

    const clickHandle = () => {
      if(isOnFlight && playerButton )
        //'play-circle' button pressed
        props.sendDroneResume(props.clientId,vehicleId)
          
      else if(isOnFlight && !playerButton)
        //'pause' button pressed
        props.sendDronePause(props.clientId,vehicleId)   
    }

    const stopClickHandle = () => {
        props.sendDroneReturnHome(props.clientId,vehicleId) 
    }
/*
    const [playerIcon,setPlayerIcon] = useState('play-circle')

 useEffect(() => {
      if(vehicleState === 'pauseState') setPlayerIcon('play-circle')//pause button pressed => change to play button 
      else if(vehicleState === 'resumeState') setPlayerIcon('pause')//play button pressed => change to pause button
      else setPlayerIcon('play-circle')                             //stop button pressed => change to play button (disabled)
    }, [vehicleState])


    const clickHandle = () => {
      if(isOnFlight && playerIcon === 'play-circle')
        //'play-circle' button pressed
        props.sendDroneResume(props.droneData.clientId,vehicleId)
          
      else if(isOnFlight && playerIcon === 'pause')
        //'pause' button pressed
        props.sendDronePause(props.droneData.clientId,vehicleId)   
    }

    <MDBBtn tag="a" size="lg" color="grey" className="button" onClick={stopClickHandle}
             style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>  
            <MDBIcon icon="stop" size="4x"/>
            </MDBBtn>
            <MDBBtn tag="a" size="lg" color="grey" className="button" onClick={clickHandle}
             style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>
              <MDBIcon icon={playerIcon} size="4x"/>
            </MDBBtn>
*/

    return (
        <div style={{ backgroundColor: "#f2f2f2", marginLeft: "50px", height: "60px", width: "150px", borderColor: "black", borderRadius: "25px", backgroundImage: "linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9) 100%)" }}>
        {
          isOnFlight ?
          (<React.Fragment>
            <div style={{height:"auto", width:"110px", margin:"0 auto", position:"center"}}>
              <button className="button" onClick={clickHandle} style={{borderRadius:"50%", height:"50px", width:"50px", paddingLeft:"16px", paddingRight:"20px", backgroundImage:playerButton?`url(${playIcon})`:`url(${pauseIcon})`, backgroundSize: "cover"}}>
              </button>
              <button className="button" onClick={stopClickHandle} style={{borderRadius:"50%", height:"50px", width:"50px", marginLeft:"5px", paddingLeft:"16px", paddingRight:"16px", backgroundImage:`url(${stopIcon})`, backgroundSize: "cover"}}>
              </button>
            </div>
          </React.Fragment>) 
          :
          (<React.Fragment>
            <div style={{height:"auto", width:"110px", margin:"0 auto", position:"relative"}}>
              <button className="button" disabled onClick={clickHandle} style={{borderRadius:"50%", height:"50px", width:"50px", paddingLeft:"16px", paddingRight:"16px", backgroundImage:playerButton?`url(${playIcon})`:`url(${pauseIcon})`, backgroundSize: "cover"}}>
              </button>
              <button className="button" disabled onClick={stopClickHandle} style={{borderRadius:"50%", height:"50px", width:"50px", marginLeft:"5px", paddingLeft:"16px", paddingRight:"16px", backgroundImage:`url(${stopIcon})`, backgroundSize: "cover"}}>
              </button>
            </div>
          </React.Fragment>
          )
          
        }
      </div>
    )
}

const mapStateToProps = state => {
  return {
    loading: state.clientData.loading,
    clientId: state.clientData.clientId,
    droneData: state.clientData.droneData,
    error: state.clientData.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
      sendDronePause: (cId,vId) => dispatch(sendDronePause(cId,vId)),
      sendDroneResume: (cId,vId) => dispatch(sendDroneResume(cId,vId)),
      sendDroneReturnHome: (cId,vId) => dispatch(sendDroneReturnHome(cId,vId))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PlayerButton)
