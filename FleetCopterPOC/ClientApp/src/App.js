import React, { Component } from 'react';
import HomeToolbar from './components/HomeToolbar';
import background from './images/background.png';
import './custom.css'
import PlayerButton from './components/PlayerButton';



export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <div>
            <div className="mainDiv">
                <HomeToolbar />
                <div className="backgroundDiv">
                    <img className="background" src={background} alt="Background" />
                </div>
                <PlayerButton />
            </div>
        </div>
    );
  }
}