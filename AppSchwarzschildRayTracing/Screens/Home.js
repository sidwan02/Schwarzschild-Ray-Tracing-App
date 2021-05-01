import React from 'react'
import { StyleSheet, View, Text } from 'react-native';
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

  const handleCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
  }

  // render() {
    return (
      <Canvas ref={handleCanvas}/>
    )
  // }
}

export default Home;
