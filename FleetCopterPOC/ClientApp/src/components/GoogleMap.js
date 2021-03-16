import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { isDroneAvailable, updateDroneData } from '../redux';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;



function GoogleMap(props) {

    const [currentDroneLocation, setCurrentDroneLocation] = useState({ latitude: 0.0, longitude: 0.0 });

    useEffect(() => {
        const interval = setInterval(async () => {
            /*props.isDroneAvailable(props.clientId, 2).then(async (result) => {
                if (result === false) {
                    console.log(props.droneData);
                    if (props.droneData && props.droneData.droneDataArr && props.droneData.droneDataArr[0].latitude && props.droneData.droneDataArr[0].longitude) {
                        await setCurrentDroneLocation({ latitude: props.droneData.droneDataArr[0].latitude, longitude: props.droneData.droneDataArr[0].longitude });
                    }
                }
            })*/
            await props.updateDroneData(props.clientId);
            if (props.droneData && props.droneData.droneDataArr && (props.droneData.droneDataArr[0].latitude || props.droneData.droneDataArr[0].longitude)) {
                await setCurrentDroneLocation({ latitude: props.droneData.droneDataArr[0].latitude, longitude: props.droneData.droneDataArr[0].longitude });
                console.log("LAT " + props.droneData.droneDataArr[0].latitude);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [props])

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY }}
                defaultCenter={{ lat: 59.95, lng: 30.33 }}
                defaultZoom={11}
            >
                <AnyReactComponent
                    lat={currentDroneLocation.latitude}
                    lng={currentDroneLocation.longitude}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );

}

const mapStateToProps = state => {
    return {
        clientId: state.clientData.clientId,
        droneData: state.clientData.droneData,
        drone1Id: state.activeDrones.drone1Id,
        changed: state.clientData.changed
    }
}

const mapDispatchToProps = dispatch => {
    return {
        isDroneAvailable: (clientId, vehicleId) => dispatch(isDroneAvailable(clientId, vehicleId)),
        updateDroneData: (cId) => dispatch(updateDroneData(cId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleMap)