import React, { Component } from 'react';
import { Layout } from './components/Layout';
import HomeToolbar from './components/HomeToolbar';
import background from './images/background.png';
//import { FetchData } from './components/FetchData';
//import { Counter } from './components/Counter';

import './custom.css'
//import HomeToolbar from './components/HomeToolbar';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <Layout>
            <div className="mainDiv">
                <HomeToolbar />
                {/*<Route path='/counter' component={Counter} />
                <Route path='/fetch-data' component={FetchData} />*/}
                <div className="backgroundDiv">
                    <img className="background" src={background} alt="Background" />
                </div>
            </div>
      </Layout>
    );
  }
}
