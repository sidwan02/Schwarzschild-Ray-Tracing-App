import React, {useState} from 'react'
import {StyleSheet, Dimensions, TouchableOpacity, View, Text, Button, TextInput} from 'react-native';
import Canvas from 'react-native-canvas';
import axios from 'axios';
import AwesomeButton from "react-native-really-awesome-button-fixed";
// import Button from "react-native-really-awesome-button-fixed";
// import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import Plotly from 'react-native-plotly';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import {StatusBar} from "expo-status-bar";
// import MyView from "../Components/MyView";

const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

function Trace3D(props) {

  if (props.visible === false) {
   return (
    <View>
    </View>
  )
  }

  let canvas



  let blackHoleX = windowWidth / 2
  let blackHoleY = windowHeight / 2


  let x_trace = []
  let y_trace = []
  let z_trace = []

  let periastron = null

  const [inputErrorText, setInputErrorText] = useState("")

  const requestRayTrace = (x0, y0, z0, alpha0, beta0, gamma0) => {


    // console.log("x0: ", x)
    // console.log("y0: ", y)
    // console.log("delta0: ", delta0)

    const toSend = {
      x0: Math.abs(x0),
      y0: Math.abs(y0),
      z0: Math.abs(z0),
      alpha0: alpha0,
      beta0: beta0,
      gamma0: gamma0

    };

    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      }
    }

    axios.post(
      "https://schwarzschild-ray-tracing-api.herokuapp.com/3D/",
      toSend,
      config
    )
      .then(response => {
        if (response.data === null) {
          console.log("DATA WAS NULL")
        }
        console.log("got data lol")
        // console.log("response: ", response.data)
        let data

        console.log("type:", typeof response.data)
        if (typeof response.data === "object") {
          data = response.data
        } else {
          // data = response.data.replace(/\bNaN\b/g, "null")
          // console.log("data: ", data)
          // console.log("see: ", response.data)
          data = JSON.parse(response.data)
        }

        // console.log(data)

          // https://stackoverflow.com/questions/35969974/foreach-is-not-a-function-error-with-javascript-array
          Array.prototype.forEach.call(data, obj => {
            // console.log("obj: ", obj)
            x_trace.push(obj["x"])
            y_trace.push(obj["y"])
            z_trace.push(obj["z"])
            // delta.push(obj["delta"])

            // console.log("x_trace: ", x_trace)
          });

        x_trace.forEach((x, i) => {
          if (periastron === null) {
            periastron = {x: x, y: y_trace[i], z: z_trace[i]}
          } else {
            // console.log("periastron: ", periastron)
            let curPeriastronDist = Math.sqrt(Math.pow(periastron.x, 2) + Math.pow(periastron.y, 2) + Math.pow(periastron.z, 2))
            let candPeriastronDist = Math.sqrt(Math.pow(x, 2) + Math.pow(y_trace[i], 2) + Math.pow(z_trace[i], 2))

            if (candPeriastronDist < curPeriastronDist) {
              periastron = {x: x, y: y_trace[i], z: z_trace[i]}
            }
          }
        })

        let trace1 = {
          name: 'Ray Trace',
          x: x_trace,
          y: y_trace,
          z: z_trace,
          type: 'scatter3d',
          mode: 'lines'
        }

        let trace2 = {
          name: 'Black Hole',
          x: [0],
          y: [0],
          z: [0],
          type: 'scatter3d',
          mode: 'markers',
          marker: {size: 2},
        }

        // console.log("periastron within request: ", periastron)

        let trace3 = {
          name: 'Periastron',
          x: [periastron.x],
          y: [periastron.y],
          z: [periastron.z],
          type: 'scatter3d',
          mode: 'markers',
          marker: {size: 2},
        }

        if (typeof alpha0 === 'string') {
          alpha0 = parseInt(alpha0)
        }

        if (typeof beta0 === 'string') {
          beta0 = parseInt(beta0)
        }

        if (typeof gamma0 === 'string') {
          gamma0 = parseInt(gamma0)
        }
        // console.log(typeof delta0)

        setStateGraph({
          data: [trace1, trace2, trace3],
          layout: {
            width: windowWidth,
            height: windowHeight - 55,
            title: 'Ray Trace from (' + x_trace[0].toFixed(2) + ', ' + y_trace[0].toFixed(2) + ', ' + z_trace[0].toFixed(2) + ') <br>with initial velocity <' + alpha0.toFixed(2) + '°, ' + beta0.toFixed(2) + '°, ' + gamma0.toFixed(2) + '°>',
            xaxis: {
      title: "x-axis",
    range: [bounds1.cartX, bounds2.cartX]
  },
      yaxis: {
      title: "y-axis",
    range: [bounds2.cartY, bounds1.cartY]
  },
      legend: {
          yanchor:"top",
    y:0.99,
    xanchor:"left",
    x:0.01
      }
          }
        })


        // console.log("x_trace: ", x_trace)

        //  console.log(x_trace)
        // console.log(y_trace)


      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const convertPixelToCartesian = (pixelX, pixelY) => {
    let cartX, cartY
    cartX = (pixelX - blackHoleX) / 10
    cartY = (blackHoleY - pixelY) / 10
    return {cartX: cartX, cartY: cartY}
  }


  const [container_style, set_container_style] = useState(
    {position: 'absolute',
    paddingTop: 50,
    width: '0%',
    height: '0%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'}
  );

  const [titleButton, setTitleButton] = useState('Trace Analysis');
  const [colorButton, setColorButton] = useState('#00a3ff');

  const clickAnalysisBuildBtn = () => {
    console.log("button click")
    if (titleButton === 'Trace Analysis') {
      setTitleButton('Build Traces')
      setColorButton('rgb(255,0,0)')

      set_container_style({
    position: 'absolute',
    paddingTop: 50,
    width: windowWidth,
    height: (windowHeight - 5),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'})
    } else {
      setTitleButton('Trace Analysis')
      setColorButton('#00a3ff')

      set_container_style({
    position: 'absolute',
    paddingTop: 50,
    width: '0%',
    height: '0%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  })
    }
    // console.log(e)
    // let ctx = canvas.getContext("2d");

    // ctx.clearRect(0, 0, windowWidth, windowHeight)



  }

let bounds1 = convertPixelToCartesian(0, 0)
  let bounds2 = convertPixelToCartesian(windowWidth, windowHeight)

  let trace1 = {
  name: 'Black Hole',
  x: [0],
  y: [0],
    z: [0],
  type: 'scatter3d',
    mode: 'markers',
    marker: {size: 2},
}

const [stateGraph, setStateGraph] = useState(
  {
    data: [trace1],
    layout: {
      width: windowWidth,
      height: windowHeight - 55,
      title: 'No Recent Trace to Display',

      xaxis: {
    uirevision: 'time'
  },
   yaxis: {
    uirevision: 'time'
  },
   zaxis: {
   uirevision: 'time'
  }


    }
  }
  );
  // = ;


  const clickManualEntryBtn = () => {
    if (xManual === ''){
      setXManual(null)
    }
    if (yManual === ''){
      setYManual(null)
    }
    if (zManual === ''){
      setZManual(null)
    }

    if (alpha0Manual === ''){
      setAlpha0Manual(null)
    }
    if (beta0Manual === ''){
      setBeta0Manual(null)
    }
    if (gamma0Manual === ''){
      setGamma0Manual(null)
    }


    if (xManual === null){
      // setXManual("10")
      setInputErrorText("x must be filled in.")
    } else if (yManual === null){
      // setYManual("10")
      setInputErrorText("y must be filled in.")
    } else if (zManual === null){
      // setZManual("10")
      setInputErrorText("z must be filled in.")
    }

    else if (alpha0Manual !== null && beta0Manual !== null && gamma0Manual === null){
      let term = Math.sqrt(1 - (alpha0Manual * Math.PI / 180)**2 - (beta0Manual * Math.PI / 180)**2)
      // console.log("term: ", term)
      setGamma0Manual((term * 180 / Math.PI) + "")
    } else if (alpha0Manual !== null && beta0Manual === null && gamma0Manual !== null){
      let term = Math.sqrt(1 - (alpha0Manual * Math.PI / 180)**2 - (gamma0Manual * Math.PI / 180)**2)
      // console.log("term: ", term)
      setBeta0Manual((term * 180 / Math.PI) + "")
    } else if (alpha0Manual === null && beta0Manual !== null && gamma0Manual !== null){
      let term = Math.sqrt(1 - (beta0Manual * Math.PI / 180)**2 - (gamma0Manual * Math.PI / 180)**2)
      // console.log("term: ", term)
      setAlpha0Manual((term * 180 / Math.PI) + "")
    }

    else if (alpha0Manual === null && beta0Manual === null && gamma0Manual !== null){
      // setAlpha0Manual(90)
      // setBeta0Manual(Math.sqrt(1 - alpha0Manual**2 - beta0Manual**2))
      setInputErrorText("At least two of alpha0, beta0 and gamma0 should be filled in.")
    } else if (alpha0Manual === null && beta0Manual !== null && gamma0Manual === null){
      // setAlpha0Manual(90)
      // setGamma0Manual(Math.sqrt(1 - alpha0Manual**2 - gamma0Manual**2))
      setInputErrorText("At least two of alpha0, beta0 and gamma0 should be filled in.")
    } else if (alpha0Manual !== null && beta0Manual === null && gamma0Manual === null){
      // setBeta0Manual(90)
      // setGamma0Manual(Math.sqrt(1 - beta0Manual**2 - gamma0Manual**2))
      setInputErrorText("At least two of alpha0, beta0 and gamma0 should be filled in.")
    }

    else if (alpha0Manual === null && beta0Manual === null && gamma0Manual === null){
      setInputErrorText("At least two of alpha0, beta0 and gamma0 should be filled in.")
    }

    if (alpha0Manual !== null && beta0Manual !== null && gamma0Manual !== null){
      if (Math.sqrt(1 - beta0Manual**2 - gamma0Manual**2) === alpha0Manual){
        setInputErrorText("")

        console.log('x: ', xManual)
        console.log('y: ', yManual)
        console.log('z: ', zManual)
        console.log('alpha0: ', alpha0Manual)
        console.log('beta0: ', beta0Manual)
        console.log('gamma0: ', gamma0Manual)

        requestRayTrace(xManual, yManual, zManual, alpha0Manual, beta0Manual, gamma0Manual)
      } else {
        setInputErrorText("alpha0, beta0 and gamma0 combination are invalid.")
      }
    }
  }

  const [xManual, setXManual] = useState(null)
  const [yManual, setYManual] = useState(null)
    const [zManual, setZManual] = useState(null)
  const [alpha0Manual, setAlpha0Manual] = useState(null)
  const [beta0Manual, setBeta0Manual] = useState(null)
  const [gamma0Manual, setGamma0Manual] = useState(null)

  const handleCanvas = (can) => {
    if (can !== null) {
      console.log("not null")
      canvas = can

      can.height = windowHeight
      can.width = windowWidth


    }
  }

  return (
    <View>
      {/*https://stackoverflow.com/questions/41948900/react-native-detect-tap-on-view*/}
      {/*onPress={canvasTap} is for just tapping*/}

      {/*<TouchableOpacity onPressIn={canvasPress} onPressOut={canvasRelease}>*/}
        {/*<Text>Hi there</Text>*/}
        <Canvas ref={handleCanvas} />
      {/*</TouchableOpacity>*/}

      <Button
        onPress={clickAnalysisBuildBtn}
        title={titleButton}
        color={colorButton}
        // accessibilityLabel="Learn more about this purple button"
      />

      <CollapsibleView title="Manual Entry" style={styles.manualEntryDiv}>
      {/*  <Button*/}
      {/*  onPress={expandManualEntryDiv}*/}
      {/*  title={'v'}*/}
      {/*  color={colorButton}*/}
      {/*  // accessibilityLabel="Learn more about this purple button"*/}
      {/*/>*/}

        <View>
          <Text>Start x:</Text>
          <TextInput
            style={styles.manualTextInput}
            placeholder="x"
            keyboardType = 'numeric'
          value={xManual}
          onChangeText={setXManual}/>
          <Text>Start y:</Text>
          <TextInput
                        style={styles.manualTextInput}
            placeholder="y"
          keyboardType = 'numeric'
          value={yManual}
          onChangeText={setYManual}/>
          <Text>Start z:</Text>
          <TextInput
                        style={styles.manualTextInput}
            placeholder="z"
          keyboardType = 'numeric'
          value={zManual}
          onChangeText={setZManual}/>
          <Text>Start angle to x-axis:</Text>
          <TextInput
                        style={styles.manualTextInput}
            placeholder="alpha0"
          keyboardType = 'numeric'
          value={alpha0Manual}
          onChangeText={setAlpha0Manual}/>
          <Text>Start angle to y-axis:</Text>
          <TextInput
                        style={styles.manualTextInput}
            placeholder="beta0"
          keyboardType = 'numeric'
          value={beta0Manual}
          onChangeText={setBeta0Manual}/>
          <Text>Start angle to z-axis:</Text>
          <TextInput
                        style={styles.manualTextInput}
            placeholder="gamma0"
          keyboardType = 'numeric'
          value={gamma0Manual}
          onChangeText={setGamma0Manual}/>

          <Button
        onPress={clickManualEntryBtn}
        title={'Trace'}
        color={colorButton}
        // accessibilityLabel="Learn more about this purple button"
      />
        </View>
    </CollapsibleView>

      <View style={styles.inputErrorTextDiv}>
        <Text style={styles.errorText}>{inputErrorText}</Text>
      </View>

      <View style={container_style}>

        <View style={styles.chartRow}>
          {/*<Plotly*/}
          {/*  data={stateGraph.data}*/}
          {/*  layout={stateGraph.layout}*/}
          {/*  // update={update}*/}
          {/*  onLoad={() => console.log('loaded')}*/}
          {/*  // debug*/}
          {/*  // enableFullPlotly*/}
          {/*/>*/}

          <Plotly
        data={stateGraph.data}
        layout={stateGraph.layout}
        enableFullPlotly
        // debug

            />
              {/*    if enableFullPlotly is not enabled cannot draw 3d graphs dummass read github issues*/}

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row'
  },
  chartRow: {
    flex: 1,
    width: '100%'
  },
  manualTextInput: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 5
  },
  manualEntryDiv: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
    borderRadius: 5,
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  inputErrorTextDiv: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    width: 2 * windowWidth / 5 ,
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
    borderRadius: 5,
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  errorText: {
    color: "red"
  },
  container: {
    position: 'absolute',
    paddingTop: 50,
    width: '0%',
    height: '0%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Trace3D;
