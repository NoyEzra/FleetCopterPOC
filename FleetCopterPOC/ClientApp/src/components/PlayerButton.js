import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import React, { useState,useEffect } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { connect } from 'react-redux'

function PlayerButton(props) {
    const [playerIcon,setPlayerIcon] = useState('play-circle')
    const [triggerResume,setTriggerResume] = useState(0)
    const [triggerPause,setTriggerPause] = useState(0)

    const isOnFlight = (props.droneData &&
                        props.droneData.droneDataArr && 
                        props.droneData.droneDataArr[0] && 
                        props.droneData.droneDataArr[0].isOnFlight)

    useEffect( () => {
      isOnFlight && playerIcon == 'play-circle' ? setPlayerIcon('pause') : setPlayerIcon('play-circle')
    }, [isOnFlight])

    useEffect(() => {
      props.sendDroneResume()
      return () => {
        props.error ?
          console.log(error) :
          isOnFlight ?
            setPlayerIcon('pause') :
            setPlayerIcon('play-circle')
      }
    },[triggerResume])

    useEffect(() => {
      props.sendDronePause()
      return () => {
        props.error ?
          console.log(error) :
          setPlayerIcon('play-circle')
      }
    },[triggerPause])

    const clickHandle = () => {
      isOnFlight && playerIcon == 'play-circle' ? setTriggerResume(!triggerResume) : setTriggerResume(!triggerPause)
    }
    return (
      <div>
        {
          isOnFlight ?
          (<React.Fragment>
            <MDBBtn tag="a" size="lg" color="grey" className="button" 
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
    droneData: state.firstDrone.droneData,
    error: state.firstDrone.error
  }
}
const mapDispatchToProps = dispatch => {
  return {
      sendDronePause: () => dispatch(sendDronePause()),
      sendDroneResume: () => dispatch(sendDroneResume())//,
      //sendDroneReturnHome: () => dispatch(sendDroneReturnHome())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PlayerButton)
