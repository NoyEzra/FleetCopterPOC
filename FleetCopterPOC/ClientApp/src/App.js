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
        <Provider store={store}>
            <div className="mainDiv" style={{ backgroundImage: `url(${background})`, backgroundRepeat: 'no-repeat', backgroundSize:'1200px 600px' }}>
                <HomeToolbar />
                <div style={{ position: 'absolute', bottom: '10px'}}>
                    <PlayerButton />                
                </div>
            </div>
        </Provider>
    );
  }
}