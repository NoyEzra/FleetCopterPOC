import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";

function PlayerButton() {
    return (
      <div>
        <MDBBtn tag="a" size="lg" color="grey" className="button" style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>
          <MDBIcon icon="pause" size="4x"/>
        </MDBBtn>
        <MDBBtn tag="a" size="lg" color="grey" className="button" style={{"borderRadius":"50%","paddingLeft": "16px","paddingRight":"16px"}}>
          <MDBIcon icon="play-circle" size="4x"/>
        </MDBBtn>
      </div>
    )
}

export default PlayerButton
