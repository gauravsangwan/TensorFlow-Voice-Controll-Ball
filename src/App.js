import React,{useEffect, useState,useRef} from "react"; 

import './App.css';

//>Import Dependency
import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';


// draw Ball
import {drawBall} from "./utilities.js";




function App() {
  

  //>create model and action states
  const [model,setModel] = useState(null)
  const [action,setAction] = useState(null)
  const [labels,setLabels]= useState(null)
  //create canvas

  const canvasRef = useRef(null);
  const [x, setX] = useState(300);
  const [y, setY] = useState(300);
  const [r, setR] = useState(10);


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
    //setTimeout(()=>model.stopListening(),10e3)
  } 
  
  //update ball state
  const numberMap ={
    "zero" : 0,
    "one" : 1,
    "two" : 2,
    "three" : 3,
    "four" : 4,
    "five" : 5,
    "six" : 6,
    "seven" : 7,
    "eight" : 8,
    "nine" : 9
  }

  


  useEffect(()=>{
    const update = action === "up" 
                            ? setY(y-50)
                            :action === "down"
                            ? setX(y+50)
                            : action ==="left"
                            ? setX(x-50)
                            : action === "right"
                            ? setX(x+50)
                            :"";

    //update r
    if(Object.keys(numberMap).includes(action)){
      setR(10*numberMap[action])
    }


    canvasRef.current.width = 600;
    canvasRef.current.height = 600;
    const ctx = canvasRef.current.getContext('2d');
    console.log(x,y,r);
    drawBall(ctx,x,y,r);
    setAction('base');

  },[action])


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
