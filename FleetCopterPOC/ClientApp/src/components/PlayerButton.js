import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import React, { useState,useEffect } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { connect } from 'react-redux'
import { sendDronePause, sendDroneResume, sendDroneReturnHome } from '../redux'

function PlayerButton(props) {
    const [playerIcon,setPlayerIcon] = useState('play-circle')
    const [triggerResume,setTriggerResume] = useState(0)
    const [triggerPause,setTriggerPause] = useState(0)

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

    const stopClickHandle = () => {
        props.sendDroneReturnHome(props.droneData.clientId,vehicleId) 
    }
    return (
      <div>
        {
          isOnFlight ?
          (<React.Fragment>
            <MDBBtn tag="a" size="lg" color="grey" className="button" onClick={stopClickHandle}
             style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>
              <MDBIcon icon="stop" size="4x"/>
            </MDBBtn>
            <MDBBtn tag="a" size="lg" color="grey" className="button" onClick={clickHandle}
             style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>
              <MDBIcon icon={playerIcon} size="4x"/>
            </MDBBtn>
          </React.Fragment>) 
          :
          (<React.Fragment>
            <MDBBtn tag="a" size="lg" color="grey" className="button" disabled 
             style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>
              <MDBIcon icon="stop" size="4x"/>
            </MDBBtn>
            <MDBBtn tag="a" size="lg" color="grey" className="button" disabled 
             style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>
              <MDBIcon icon={playerIcon} size="4x"/>
            </MDBBtn>
          </React.Fragment>)
        }
      </div>
    )
}

const mapStateToProps = state => {
  return {
    loading: state.firstDrone.loading,
    droneData: state.firstDrone.droneData,
    error: state.firstDrone.error
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
