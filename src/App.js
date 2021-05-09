import React, { Component, Fragment } from 'react';
import "./index.css";
import { Camera } from './components/Camera/camera';

class App extends Component {
  render() {
    return <Fragment>
      <Camera />
    </Fragment>
  };
}
export default App;