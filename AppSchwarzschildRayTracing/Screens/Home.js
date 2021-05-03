import React from 'react'
import {Dimensions, InteractionManager, TouchableOpacity, View} from 'react-native';
import Canvas from 'react-native-canvas';

// import Constants from "expo-constants";
// const { manifest } = Constants;
import axios from 'axios';


function Home() {

  let canvas

  let x_trace = []
  let y_trace = []
  let z_trace = []
  let delta = []

  const requestRayTrace = (x, y, delta0) => {
    console.log("x: ", x)
    console.log("y: ", y)
    console.log("delta0: ", delta0)


    // const uri = `http://${manifest.debuggerHost.split(':').shift()}:8000`;
    // console.log("uri: ", uri)


    // fetch('https://schwarzschild-ray-tracing-api.herokuapp.com/', {
    // // fetch(uri, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     x : x,
    //     y : y,
    //     delta0 : delta0
    //   })
    // })
    // .then((response) => {
    //   console.log("GOT RESPONSE")
    //   // console.log(response)
    //   response.json()
    // })
    // .then((json) => {
    //   console.log("WORKED")
    //   console.log("json: ", json)
    // })
    // .catch((error) => {
    //   console.log("ERROR")
    //   console.error(error);
    // });

    if (delta0 < 0) {
      delta0 = - (180 - Math.abs(delta0))
    }


      const toSend = {
          x: Math.abs(x),
          y : Math.abs(y),
          z: 0,
          delta0 : delta0
      };

      let config = {
          headers: {
              "Content-Type": "application/json",
              'Access-Control-Allow-Origin': '*',
          }
      }

      axios.post(
          "https://schwarzschild-ray-tracing-api.herokuapp.com/",
          toSend,
          config
      )
          .then(response => {
            // console.log("response: ", response.data)
            response.data.forEach(obj => {
              // console.log("obj: ", obj)
                   x_trace.push(obj["x"])
                   y_trace.push(obj["y"])
                   z_trace.push(obj["z"])
                   delta.push(obj["delta"])
               });

            // console.log("x_trace: ", x_trace)
            calculateWaypoints()
    //  console.log(x_trace)
    // console.log(y_trace)

     let start = Date.now();
      let max_i = x_trace.length - 1
      let cur_i = 0

      requestAnimationFrame(function animateTrace(timestamp) {
        // console.log("animating")
            let interval = Date.now() - start

          if (cur_i < max_i) {
            drawTraceSegment(cur_i); // move element down
          }
          cur_i++;

          // console.log(interval)
          // if (interval < 1000){
          // setTimeout(() => {
            requestAnimationFrame(animateTrace); // queue request for next frame
          // }, 200);

          // }
        });
          })
          .catch(function (error) {
              console.log(error);
          });

//     let data = [
//     {
//         "id": null,
//         "x": 10.0,
//         "y": 0.0,
//         "z": 0.0,
//         "delta": 0.0
//     },
//     {
//         "id": null,
//         "x": 10.000000408163341,
//         "y": 0.00451754000618463,
//         "z": 0.0,
//         "delta": 0.007765078344209277
//     },
//     {
//         "id": null,
//         "x": 10.00000020408165,
//         "y": 0.009035081671874294,
//         "z": 0.0,
//         "delta": 0.1430300914462987
//     },
//     {
//         "id": null,
//         "x": 9.99965775067554,
//         "y": 0.15136817581368836,
//         "z": 0.0,
//         "delta": 0.38763027483381934
//     },
//     {
//         "id": null,
//         "x": 9.998707427447483,
//         "y": 0.2937350087587188,
//         "z": 0.0,
//         "delta": 0.6321003241914409
//     },
//     {
//         "id": null,
//         "x": 9.997148887497357,
//         "y": 0.43616735124592115,
//         "z": 0.0,
//         "delta": 1.611080828023223
//     },
//     {
//         "id": null,
//         "x": 9.968964272472101,
//         "y": 1.4414805494180285,
//         "z": 0.0,
//         "delta": 3.299741724112162
//     },
//     {
//         "id": null,
//         "x": 9.91015852271776,
//         "y": 2.4630439562792907,
//         "z": 0.0,
//         "delta": 4.933256347128732
//     },
//     {
//         "id": null,
//         "x": 9.819593201883066,
//         "y": 3.5133939408430908,
//         "z": 0.0,
//         "delta": 6.4847659537454945
//     },
//     {
//         "id": null,
//         "x": 9.695373215578176,
//         "y": 4.607122710444178,
//         "z": 0.0,
//         "delta": 7.929363846374827
//     },
//     {
//         "id": null,
//         "x": 9.534609051732522,
//         "y": 5.762106005759448,
//         "z": 0.0,
//         "delta": 9.245038933465056
//     },
//     {
//         "id": null,
//         "x": 9.33302895049191,
//         "y": 7.001236150493375,
//         "z": 0.0,
//         "delta": 10.413712471731051
//     },
//     {
//         "id": null,
//         "x": 9.08435424267942,
//         "y": 8.355022146538596,
//         "z": 0.0,
//         "delta": 11.422337416357454
//     },
//     {
//         "id": null,
//         "x": 8.779276451521287,
//         "y": 9.865704039871954,
//         "z": 0.0,
//         "delta": 12.262460195946018
//     },
//     {
//         "id": null,
//         "x": 8.403761493145772,
//         "y": 11.594161357338503,
//         "z": 0.0,
//         "delta": 12.937164963502543
//     },
//     {
//         "id": null,
//         "x": 7.935864855803529,
//         "y": 13.631876858852028,
//         "z": 0.0,
//         "delta": 13.452313317814308
//     },
//     {
//         "id": null,
//         "x": 7.340038788888875,
//         "y": 16.12379740926888,
//         "z": 0.0,
//         "delta": 13.822648861311402
//     },
//     {
//         "id": null,
//         "x": 6.555262334644693,
//         "y": 19.31463400336815,
//         "z": 0.0,
//         "delta": 14.069269890747945
//     },
//     {
//         "id": null,
//         "x": 5.468336301270851,
//         "y": 23.653374106461097,
//         "z": 0.0,
//         "delta": 14.217577335949475
//     },
//     {
//         "id": null,
//         "x": 3.8447347203959468,
//         "y": 30.063950527396983,
//         "z": 0.0,
//         "delta": 14.294763676953627
//     },
//     {
//         "id": null,
//         "x": 1.1098608012191955,
//         "y": 40.80144124826915,
//         "z": 0.0,
//         "delta": 14.326840272551697
//     },
//     {
//         "id": null,
//         "x": -4.609817589586663,
//         "y": 63.20523831526391,
//         "z": 0.0,
//         "delta": 14.335690209291807
//     },
//     {
//         "id": null,
//         "x": -24.88583953960388,
//         "y": 142.57461522796797,
//         "z": 0.0,
//         "delta": 14.336300314774297
//     },
//     {
//         "id": null,
//         "x": -38.59615418612311,
//         "y": 196.24050775016062,
//         "z": 0.0,
//         "delta": 14.336300314774297
//     }
// ]

    // console.log(data)

    // haha pingu

    // data.forEach(obj => {
    //        x_trace.push(obj["x"])
    //        y_trace.push(obj["y"])
    //        z_trace.push(obj["z"])
    //        delta.push(obj["delta"])
    //    })
  };

 //  useEffect(() => {
 //    fetch("http://localhost:8000", {
 //      method:"POST"
 //    })
 //    .then(response => response.json())
 //      .then(data => {
 //       let x_trace = []
 //       let y_trace = []
 //       let z_trace = []
 //       let delta = []
 //
 //       data.forEach(obj => {
 //           x_trace.push(obj["x"])
 //           y_trace.push(obj["y"])
 //           z_trace.push(obj["z"])
 //           delta.push(obj["dela"])
 //       })
 //       .catch(function (error) {
 //               console.log(error);
 //           });
 // })
 //  }, [])
 //  const requestRayTrace = (x, y, delta0) => {
 //    console.log("requesting")
 //       const toSend = {
 //           x : x,
 //           y : y,
 //           delta0 : delta0
 //       };
 //
 //       let config = {
 //           headers: {
 //               "Content-Type": "application/json",
 //               'Access-Control-Allow-Origin': '*',
 //           }
 //       }

       /*axios.post(
         // https://stackoverflow.com/questions/49370747/network-error-with-axios-and-react-native
           "https://10.0.2.2:8000/",
           toSend,
           config
       )
           .then(response => {
             console.log("GOT RESPONSE")
               let x_trace = []
               let y_trace = []
               let z_trace = []
               let delta = []

               response.data.forEach(obj => {
                   x_trace.push(obj["x"])
                   y_trace.push(obj["y"])
                   z_trace.push(obj["z"])
                   delta.push(obj["delta"])
               });

               console.log(x_trace)
           })

           .catch(function (error) {
             console.log("ERROR")
               console.log(error);
           });*/
   //    axios.post('localhost:8000/').then(response => {  // localhost:8000/get works
   //      console.log("worked")
   //          // this.setState({foo:response.data});
   //      }).catch(error => {
   //        console.log("error", error)
   //          // console.log(error);
   //      });
   // }

  let pressX
  let pressY
    let releaseX
  let releaseY

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  let blackHoleX = windowWidth / 2
  let blackHoleY = windowHeight / 2

  const drawBlackHole = () => {
    let ctx = canvas.getContext("2d");

    // black hole
    ctx.beginPath()
    ctx.arc(blackHoleX, blackHoleY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeStyle = '#000000';

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  const handleCanvas = (can) => {
    canvas = can

    can.height = windowHeight
    can.width = windowWidth

    drawBlackHole()
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

  const getDelta0 = (x_ray, y_ray) => {
    // console.log(pressY)
    // console.log(releaseY)
    // console.log(pressX)
    // console.log(releaseX)
    let negative_x
    negative_x = x_ray < 0;

    let theta // angle to line parallel to x axis
    // theta = 180 / Math.PI * (Math.atan(Math.abs(Math.abs(pressY) - Math.abs(releaseY)) / Math.abs(Math.abs(pressX) - Math.abs(releaseX))))
    theta = 180 / Math.PI * (Math.atan(Math.abs(pressY - releaseY) / Math.abs(pressX - releaseX)))
    if (pressX > releaseX) {
      theta = 180 - theta // since the angle we want has 0 at +ve y axis side
    }

    if (negative_x) {
      theta = 180 - theta
      console.log("is negative")
    } else {
      console.log("is positive")
    }

    console.log("theta: ", theta)


    let phi
    phi = 180 / Math.PI * (Math.atan(Math.abs(pressY - blackHoleY) / Math.abs(Math.abs(pressX) - blackHoleX)))

    let delta0
    delta0 = theta - phi



    return delta0
  }

  const convertCartesianToPixel = (cartX, cartY) => {
    let pixelX, pixelY
    pixelX = cartX * 10 + blackHoleX
    pixelY = blackHoleY - cartY * 10
    return {pixelX: pixelX, pixelY: pixelY}
  }

  const convertPixelToCartesian = (pixelX, pixelY) => {
    let cartX, cartY
    cartX = (pixelX - blackHoleX) / 10
    cartY = (blackHoleY - pixelY) / 10
    return {cartX: cartX, cartY: cartY}
  }
  let acc_angle = 0
  const drawTraceSegment = (i) => {
    // console.log(i)
    // console.log("drawing")
    let ctx = canvas.getContext("2d");

    // for (let i = 0; i < x_trace.length - 1; i++) {
    let pixelObjStart = convertCartesianToPixel(x_trace[i], y_trace[i])
    let pixelObjEnd = convertCartesianToPixel(x_trace[i + 1], y_trace[i + 1])

    // const gradient = ctx.createLinearGradient(pixelObjStart.pixelX, pixelObjStart.pixelY, pixelObjStart.pixelX + 50, pixelObjStart.pixelY + 50);
    // gradient.addColorStop(0, 'black');
    // gradient.addColorStop(1, 'white');
    // ctx.save()
    // ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillStyle = "black";

    let angle = Math.PI / 2 - Math.atan((pixelObjEnd.pixelY - pixelObjStart.pixelY) / (pixelObjEnd.pixelX - pixelObjStart.pixelX))
    // acc_angle += 0.1

    // ctx.translate(pixelObjStart.pixelX, pixelObjStart.pixelY);
    // ctx.rotate(-angle);
    ctx.fillRect(pixelObjStart.pixelX, pixelObjStart.pixelY, 10, 10);
    // ctx.fillStyle = "rgba(255, 255, 255, 0.5)";

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    // ctx.moveTo(pixelObjStart.pixelX, pixelObjStart.pixelY);
    // ctx.lineTo(pixelObjEnd.pixelX, pixelObjEnd.pixelY);
    // ctx.stroke();
    // ctx.closePath();
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.restore()
    // }
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlackHole()
  }

  const numListRangeInclusive = (start, stop, divisions) => {
    let step = Math.abs(start - stop) / divisions
    // console.log("start: ", start)
    // console.log("stop: ", stop)
    // console.log("step: ", step)
        let list = []
        let curVal = start
    let condition
        if (start < stop) {
          while (curVal <= stop) {
            list.push(curVal)
          curVal += step


            curVal = Number(parseFloat((curVal) + "").toPrecision(12))

        }
        } else {
          while (curVal >= stop) {
            list.push(curVal)

          curVal -= step

            curVal = Number(parseFloat((curVal) + "").toPrecision(12))

        }
        }


        // console.log("list: ", list)
        return list
    }

  const calculateWaypoints = () => {
    let waypointsX = []
    let waypointsY = []
    const dist_to_div_ratio = 1

    for (let i = 0; i < x_trace.length - 1; i++) {
      let divisions = Math.sqrt(Math.pow((x_trace[i] - x_trace[i + 1]), 2) + Math.pow((y_trace[i] - y_trace[i + 1]), 2)) * dist_to_div_ratio
      waypointsX = waypointsX.concat(numListRangeInclusive(x_trace[i], x_trace[i + 1], divisions))
      waypointsY = waypointsY.concat(numListRangeInclusive(y_trace[i], y_trace[i + 1], divisions))
    }

    x_trace = waypointsX
    // console.log("x_trace: ", x_trace)
    y_trace = waypointsY

  }

  // const divideLineSegment = (x_start, x_end, y_start, y_end, divisions) => {
  //   let x_divided =
  //   let y_divided = numListRangeInclusive(y_start, y_end, divisions)
  //
  //
  //
  //   return {x_divided: x_divided, y_divided:y_divided}
  // }

   const canvasRelease = (e) => {
    console.log("release")
    console.log("-------")
    // console.log(e.nativeEvent.locationX)
    // console.log(e.nativeEvent.locationY)

     x_trace = []
     y_trace = []

     releaseX = e.nativeEvent.locationX
     releaseY = e.nativeEvent.locationY

     // let pressCoorX = pressX - blackHoleX
     // let pressCoorY = blackHoleY - pressY

     let pressCoorObj = convertPixelToCartesian(pressX, pressY)

     let delta0 = getDelta0(pressCoorObj.cartX, pressCoorObj.cartY)

     requestRayTrace(pressCoorObj.cartX, pressCoorObj.cartY, delta0)
     // console.log("x_trace: ", x_trace)
     // console.log("y_trace: ", y_trace)

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
