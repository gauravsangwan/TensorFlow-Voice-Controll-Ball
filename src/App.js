import React,{useEffect, useState} from "react"; 
import logo from './logo.svg';
import './App.css';

//>Import Dependency
import * as tf from '@tensorflow/tfjs';
import * as speech from '@tensorflow-models/speech-commands';








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
        <h1> Speech To Text Converstion using tensorflowJS | Gaurav Sangwan</h1>
        <p>This ReactJS application can convert following sounds to text , zero to nine and go,stop,up,down,left,right,yes,no and two more possibilities of Unknown noises and background noise.   </p>


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
