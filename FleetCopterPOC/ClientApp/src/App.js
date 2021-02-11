import React, { Component } from 'react';
import { Provider } from 'react-redux'
import HomeToolbar from './components/HomeToolbar';
import background from './images/background.png';
import './custom.css'
import PlayerButton from './components/PlayerButton';
import store from './redux/store'



export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <Provider store = {store}>
            <div className="mainDiv">
                <HomeToolbar />
                <div className="backgroundDiv">
                    <img className="background" src={background} alt="Background" />
                </div>
                <PlayerButton />
            </div>
        </Provider>
    );
  }
}