import React from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Canvas from 'react-native-canvas';

function Home() {
  // const requestRayTrace = (x, y, delta0) => {
  //      const toSend = {
  //          x : x,
  //          y : y,
  //          delta0 : delta0
  //      };
  //
  //      let config = {
  //          headers: {
  //              "Content-Type": "application/json",
  //              'Access-Control-Allow-Origin': '*',
  //          }
  //      }
  //
  //      axios.post(
  //          "http://localhost:8000",
  //          toSend,
  //          config
  //      )
  //          .then(response => {
  //              let x_trace = []
  //              let y_trace = []
  //              let z_trace = []
  //              let delta = []
  //
  //              response.data.forEach(obj => {
  //                  x_trace.push(obj["x"])
  //                  y_trace.push(obj["y"])
  //                  z_trace.push(obj["z"])
  //                  delta.push(obj["dela"])
  //              });
  //          })
  //
  //          .catch(function (error) {
  //              console.log(error);
  //          });
  //  }

  // return (
  //   <View></View>
  // );

  const windowWidth = Dimensions.get('window').width;
  console.log(windowWidth)
  const windowHeight = Dimensions.get('window').height;
  console.log(windowHeight)

  const handleCanvas = (canvas) => {
    canvas.height = windowHeight
    canvas.width = windowWidth

    let ctx = canvas.getContext("2d");

    // blackhole
    ctx.arc(windowWidth / 2, windowHeight / 2, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeStyle = '#000000';

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  return (
    <View >
      <Canvas ref={handleCanvas} />
    </View>
  )
}

export default Home;
