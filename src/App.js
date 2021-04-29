
import React, { Component, Fragment } from 'react';
import "./index.css";
//import Canvas from './components/graficEditor/GraficEditor';
import {Camera} from './components/FaceMash/camera';
//import Palette from './components/Palette/Palette'
//import DrawToolBar from './components/DrawToolBar'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      value: 10
    }
    
  }
  
  render(){
    return <Fragment> 
      <Camera/>
    </Fragment >
  };
}

//<Canvas  style ={{width: '450px', height: '450px', border:'2px solid red'}}/>
// <video muted className={styles.webcam}></video>
export default App;