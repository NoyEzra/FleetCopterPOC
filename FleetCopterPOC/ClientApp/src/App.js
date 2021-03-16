import React, { Component } from 'react';
import { Provider } from 'react-redux'
import HomeToolbar from './components/HomeToolbar';
import background from './images/background.png';
import './custom.css'
import PlayerButton from './components/PlayerButton';
import GoogleMap from './components/GoogleMap';
import store from './redux/store'



export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <Provider store={store}>
            <div className="mainDiv">
                <HomeToolbar />
                <GoogleMap />
                <div style={{ position: 'absolute', bottom: '10px'}}>
                    <PlayerButton />                
                </div>
            </div>
        </Provider>
    );
  }
}