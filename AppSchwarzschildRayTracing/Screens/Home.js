import React from 'react'
import {StyleSheet, View, Text, Dimensions, TouchableOpacity} from 'react-native';
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

  let pressX
  let pressY
    let releaseX
  let releaseY

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let blackHoleX = windowWidth / 2
  let blackHoleY = windowHeight / 2

  const handleCanvas = (canvas) => {
    canvas.height = windowHeight
    canvas.width = windowWidth

    let ctx = canvas.getContext("2d");

    // black hole
    ctx.arc(blackHoleX, blackHoleY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeStyle = '#000000';

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  // const canvasTap = (e) => {
  //   // console.log(e)
  //   console.log("tap")
  // }

  const canvasPress = (e) => {
    // https://stackoverflow.com/questions/36862765/react-native-get-the-coordinates-of-my-touch-event
    // console.log("press")
    // console.log("-----")
    // console.log(e.nativeEvent.locationX)
    // console.log(e.nativeEvent.locationY)
    pressX = e.nativeEvent.locationX
    pressY = e.nativeEvent.locationY
  }

  const getDelta0 = () => {
    let theta
    theta = 180 * Math.PI / (Math.tan(Math.abs(pressY - releaseY) / Math.abs(pressX - pressY)))
    if (pressX < releaseX) {
      theta = 180 - theta // since the angle we want has 0 at +ve y axis side
    }

    let phi
    phi = 180 * Math.PI / (Math.tan(Math.abs(releaseY - blackHoleY) / Math.abs(pressY - blackHoleX)))

    let delta0
    delta0 = theta - phi

    return delta0
  }

   const canvasRelease = (e) => {
    console.log("release")
    console.log("-------")
    console.log(e.nativeEvent.locationX)
    console.log(e.nativeEvent.locationY)

     releaseX = e.nativeEvent.locationX
       releaseY = e.nativeEvent.locationY

     let pressCoorX = pressX - blackHoleX
     let pressCoorY = pressY - blackHoleY

     let delta0 = getDelta0()

     requestRayTrace(pressCoorX, pressCoorY, delta0)
  }

  return (
    <View>
      {/*https://stackoverflow.com/questions/41948900/react-native-detect-tap-on-view*/}
      {/*onPress={canvasTap} is for just tapping*/}
      <TouchableOpacity onPressIn={canvasPress} onPressOut={canvasRelease}>
        <Canvas ref={handleCanvas} />
      </TouchableOpacity>
    </View>
  )
}

export default Home;
