import React,{useEffect, useState,useRef} from "react"; 
import logo from './logo.svg';
import './App.css';

//>Import Dependency
import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';


// draw Ball
import {drawBall} from "./utilities.js";

//create canvas
const canvasRef = useRef(null);
const [x, setX] = useState(300);
const [y, setY] = useState(300);
const [r, setR] = useState(10);


function App() {

  //>create model and action states
  const [model,setModel] = useState(null)
  const [action,setAction] = useState(null)
  const [labels,setLabels]= useState(null)
  //>create recognizerr

  const loadModel = async() =>{
    const recognizer = await speech.create("BROWSER_FFT")
    console.log("Model Loaded Successfully !!!")
    await recognizer.ensureModelLoaded()
    console.log(recognizer.wordLabels())
    setModel(recognizer)
    setLabels(recognizer.wordLabels())
  }

  useEffect(()=>{loadModel()},[]);

  function argMax(arr){
    return arr.map((x,i)=>[x,i]).reduce((r,a)=>(a[0]>r[0]?a:r))[1];
  }
  //>listen for action

  const recognizeCommands = async ()=>{
    console.log('I am listening for commands ')
    model.listen(result=>{
      console.log(result)
      setAction(labels[argMax(Object.values(result.scores))])
      console.log(action)
    },{includeSpectrogram:true,probabilityThreshold: 0.9})
    setTimeout(()=>model.stopListening(),10e3)
  } 




  return (
    <div className="App">
      <header className="App-header">
        <h1> Voice-Control-Move-Ball | Gaurav Sangwan</h1>
        <p> Use your voice to move the ball </p>
        <canvas
        ref = {canvasRef}
        style = {{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex : 9,
          width : 640,
          height : 640
        }} />



        <button onClick={recognizeCommands} >Command Input</button>
        {action 
          ? <div>{action}</div>
          : <div>No Action Detected</div>
        }

      </header>
    </div>
  );
}

export default App;
