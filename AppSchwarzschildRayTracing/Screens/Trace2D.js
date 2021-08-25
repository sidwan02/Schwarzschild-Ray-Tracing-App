import React, {useState} from 'react'
import {StyleSheet, Dimensions, TouchableOpacity, View, Text, Button, TextInput} from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import axios from 'axios';
import AwesomeButton from "react-native-really-awesome-button-fixed";
// import Button from "react-native-really-awesome-button-fixed";
// import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import Plotly from 'react-native-plotly';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
// import RNFS from 'react-native-fs';
import {StatusBar} from "expo-status-bar";
import * as Expo from "expo-asset";
// import MyView from "../Components/MyView";

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

function Trace2D(props) {

  if (props.visible === false) {
    return (
    <View>
    </View>
  );
  }

  let canvas

  let x_trace = []
  let y_trace = []
  let z_trace = []
  let delta = []

    const [inputErrorText, setInputErrorText] = useState("")

  const [analysisBtnDiv, setAnalysisBtnDiv] = useState({
    position: 'absolute',
    top: windowHeight - 50,
    right: 10,
    // left: 10,
    // zIndex: -10
  })


  let pop = "hi"

  let final_x_list = []
  let final_y_list = []

  let periastron = null

  let title

  const [chartRow, setChartRow] = useState({
    paddingTop: 50,
    position: 'absolute',
    height: 0,
    // flex: 1,
    width: 0
  })

  const requestRayTrace = (x, y, delta0) => {


    console.log("x0: ", x)
    console.log("y0: ", y)
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
      // delta0 = - (180 - Math.abs(delta0)) // diffeq
      delta0 = delta0 // integral
    }

      const toSend = {
          x0: Math.abs(x),
          y0 : Math.abs(y),
          // z: 0,
          delta0 : delta0
      };

      let config = {
          headers: {
              "Content-Type": "application/json",
              'Access-Control-Allow-Origin': '*',
          }
      }

      axios.post(
          "https://schwarzschild-ray-tracing-api.herokuapp.com/2D/",
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

            if (x >= 0 && y >= 0) {
               // https://stackoverflow.com/questions/35969974/foreach-is-not-a-function-error-with-javascript-array
               Array.prototype.forEach.call(data, obj => {
              // console.log("obj: ", obj)
                   x_trace.push(obj["x"])
                   y_trace.push(obj["y"])
                   // z_trace.push(obj["z"])
                   // delta.push(obj["delta"])

                 // console.log("x_trace: ", x_trace)
               });

              }
              else if (x < 0 && y >= 0) {
              // console.log("quad 2")
              // quad 2
              Array.prototype.forEach.call(data, obj => {
              // console.log("obj: ", obj)
                   x_trace.push(-obj["x"])
                   y_trace.push(obj["y"])
                   // z_trace.push(obj["z"])
                   // delta.push(obj["delta"])
               });

            } else if (x < 0 && y < 0) {
              // quad 3
              // let count = 0
              Array.prototype.forEach.call(data, obj => {
              //   if (count < 10) {
              // // console.log("obj: ", obj)
              //   }
              //   count += 1

                   x_trace.push(-obj["x"])
                   y_trace.push(-obj["y"])
                   // z_trace.push(obj["z"])
                   // delta.push(obj["delta"])
               });
            } else if (x >= 0 && y < 0) {
              // quad 4
              Array.prototype.forEach.call(data, obj => {
              // console.log("obj: ", obj)
                   x_trace.push(obj["x"])
                   y_trace.push(-obj["y"])
                   // z_trace.push(obj["z"])
                   // delta.push(obj["delta"])
               });
            }

              // console.log("y_trace: ", y_trace)


//               dataGraph = (
//               {
//   __id: 'up',
//   x: x_trace,
//   y: y_trace,
//   type: 'scatter',
//                 mode: 'lines+markers'
// }
//             )

            // setDataGraph(
            //
            // )

            // this is the thing I commented out because I'm gonna hopefully make the API uniformly spaced
            // calculateWaypoints()

            let flag_no_periastron = false

            let c = 0

            x_trace.forEach((x, i) => {
              if (periastron === null) {
                periastron = {x: x, y: y_trace[i]}
              } else {
                // console.log("periastron: ", periastron)
                let curPeriastronDist = Math.sqrt(Math.pow(periastron.x, 2) + Math.pow(periastron.y, 2))
                let candPeriastronDist = Math.sqrt(Math.pow(x, 2) + Math.pow(y_trace[i], 2))

                if (candPeriastronDist.toFixed(5) === curPeriastronDist.toFixed(5)) {
                  c += 1
                  if (c === 5){
                    flag_no_periastron = true
                  }
                } else if (candPeriastronDist < curPeriastronDist) {
                  periastron = {x: x, y: y_trace[i]}
                  c = 0
                }
              }
            })

            // x_trace.reverse().forEach((x, i) => {
            //   let curPeriastronDist = Math.sqrt(Math.pow(periastron.x, 2) + Math.pow(periastron.y, 2))
            //   let candPeriastronDist = Math.sqrt(Math.pow(x, 2) + Math.pow(y_trace[i], 2))
            //
            //
            // })

            console.log("flag_no_periastron: ", flag_no_periastron)

              let trace1 = {
  name: 'Ray Trace',
  x: x_trace,
  y: y_trace,
  type: 'scatter',
                mode: 'lines'
}

let trace2 = {
  name: 'Black Hole',
  x: create_func_arr(Math.cos, theta_arr),
    y: create_func_arr(Math.sin, theta_arr),
  type: 'line',
    mode: 'markers',
    line: {
      color: 'black'
    },

    // markers: false,
    fill: 'toself',
    fillcolor: 'black',
}

              // console.log("periastron within request: ", periastron)

              let trace3 = {
  name: 'Periastron',
  x: [periastron.x],
  y: [periastron.y],
  type: 'scatter',
    mode: 'markers'
}

              if (typeof delta0 === 'string') {
                delta0 = parseInt(delta0)
              }
              // console.log(typeof delta0)

            if (flag_no_periastron){
              setStateGraph({
    data: [trace1, trace2],
    // data: [trace1, trace3],
    layout: { width: windowWidth,
      height: windowHeight - 55,
      title: 'Ray Trace from (' + x_trace[0].toFixed(2) + ', ' + y_trace[0].toFixed(2) + ') <br>with initial angle ' + delta0.toFixed(2) + '°',
    xaxis: {
      title: "x-axis [SR Units]",
    range: [-bounds2.cartX, bounds2.cartX]
  },
      yaxis: {
      title: "y-axis [SR Units]",
    range: [-Math.abs(bounds2.cartY), Math.abs(bounds2.cartY)],
        scaleanchor:"x", scaleratio:1,
  },
      legend: {
          yanchor:"top",
    y:0.99,
    xanchor:"left",
    x:0.01
      }
    },

  })
            } else {
             setStateGraph({
    data: [trace1, trace2, trace3],
    // data: [trace1, trace3],
    layout: { width: windowWidth,
      height: windowHeight - 55,
      title: 'Ray Trace from (' + x_trace[0].toFixed(2) + ', ' + y_trace[0].toFixed(2) + ') <br>with initial angle ' + delta0.toFixed(2) + '°',
    xaxis: {
      title: "x-axis [SR Units]",
    range: [-bounds2.cartX, bounds2.cartX]
  },
      yaxis: {
      title: "y-axis [SR Units]",
    range: [-Math.abs(bounds2.cartY), Math.abs(bounds2.cartY)],
        scaleanchor:"x", scaleratio:1
  },
      legend: {
          yanchor:"top",
    y:0.99,
    xanchor:"left",
    x:0.01
      }
    },

  })
            }





            // console.log("x_trace: ", x_trace)

    //  console.log(x_trace)
    // console.log(y_trace)


     let start = Date.now();
      let max_i = x_trace.length - 1
      let cur_i = 0

            console.log("bfbababa: ", final_x_list)

            prev_x = 0
            prev_y = 0

            let target_length = 0

            x_trace.forEach((x_val, i) => {
              let y_val = y_trace[i]
              if (i === 0) {
                prev_x = x_val
                prev_y = y_val
                // prev_r = Math.sqrt((x_val - prev_x) ** 2 + (y_val - prev_y) ** 2)
              } else {
                let cur_r = Math.sqrt((x_val - prev_x) ** 2 + (y_val - prev_y) ** 2)
                if (cur_r >= target_length) {
                  target_length = cur_r
                }
              prev_x = x_val
                prev_y = y_val
              }
            })

            target_length = Math.min(target_length, 0.4)
            // target_length = 1

            // essentially if we go above the threshold we pick the point immediately before so this threshold is guaranteed to be the upper bound
            // the prev and from are different because the from changes only when you add a new point whereas the prev simply refers to the prev point with reference to x_val and y_val.
            let prev_x = 0
            let prev_y = 0

            let from_x = 0
            let from_y = 0

            x_trace.forEach((x_val, i) => {
              let y_val = y_trace[i]
              if (i === 0) {
                // prev_r = Math.sqrt(x_val ** 2 + y_val ** 2)
                from_x = x_val
                from_y = y_val
                // console.log("final_x_list:", final_x_list)
                final_x_list.push(x_val)
                final_y_list.push(y_val)
                prev_x = x_val
                  prev_y = y_val
              } else {
                // let cur_r = Math.sqrt(x_val ** 2 + y_val ** 2)
                // if (Math.abs(prev_r - cur_r) >= target_length) {
                if (Math.sqrt((x_val - from_x)**2 + (y_val - from_y)**2) >= target_length) {
                  final_x_list.push(prev_x)
                  final_y_list.push(prev_y)
                  // prev_r = cur_r
                  from_x = x_val
                  from_y = y_val
                  // console.log("cur_r:", cur_r)
                  prev_x = x_val
                  prev_y = y_val
                } else {
                  prev_x = x_val
                  prev_y = y_val
                }
              }
            })

            console.log("target_length: ", target_length)

            // console.log("x_trace: ", x_trace)
            // console.log("y_trace: ", y_trace)
            //
            // console.log("final_x_list: ", final_x_list)
            // console.log("final_y_list: ", final_y_list)

            // let acc_dist = 0.01
            // let prev_r = null

            let colorStop = Math.random()

    let color = rainbowStop(colorStop)

      // requestAnimationFrame(function animateTrace(timestamp) {
      //   // console.log("animating")
      //       let interval = Date.now() - start
      //
      //   let x_end_cart = x_trace[cur_i + 1], y_end_cart = y_trace[cur_i + 1]
      //
      //     if (cur_i < max_i) {
      //       let cur_r = Math.sqrt(x_end_cart ** 2 + y_end_cart ** 2)
      //       if (prev_r == null) {
      //         drawTraceSegment(cur_i, color); // move element down
      //       } else {
      //         if (Math.abs(cur_r - prev_r) + acc_dist < 0.002) {
      //           acc_dist += Math.abs(cur_r - prev_r)
      //         } else {
      //           drawTraceSegment(cur_i, color); // move element down
      //           acc_dist = 0
      //         }
      //       }
      //
      //     prev_r = cur_r
      //
      //
      //     }
      //     cur_i++;
      //
      //     // console.log(interval)
      //     // if (interval < 1000){
      //     // setTimeout(() => {
      //
      //
      //   let buffer = 2//2
      //   if (x_end_cart > 20 + buffer || x_end_cart < -20 - buffer || y_end_cart > 40 + buffer || y_end_cart < -40 - buffer
      //     || cur_i === max_i) {
      //     let i = 0
      //     // console.log("boba")
      //     let ctx = canvas.getContext("2d");
      //     // console.log("äloha")
      //     while (i < 20) {
      //       // console.log("clearing up")
      //       ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      //       ctx.fillRect(0, 0, windowWidth, windowHeight);
      //
      //       drawCoordinateAxes()
      //       drawBlackHole()
      //       i = i + 1;
      //     }
      //     console.log("stopping trace")
      //   } else {
      //       requestAnimationFrame(animateTrace); // queue request for next frame
      //   }
      //
      //
      //     // }, 200);
      //
      //     // }
      //   });

            requestAnimationFrame(function animateTrace(timestamp) {
        // console.log("animating")
            let interval = Date.now() - start

        // let x_end_cart = x_trace[cur_i + 1], y_end_cart = y_trace[cur_i + 1]

              let x_end_cart = final_x_list[cur_i + 1], y_end_cart = final_y_list[cur_i + 1]

          if (cur_i < max_i) {
            // let cur_r = Math.sqrt(x_end_cart ** 2 + y_end_cart ** 2)
            // if (prev_r == null) {
            //   drawTraceSegment(cur_i, color); // move element down
            // } else {
              // if (Math.abs(cur_r - prev_r) + acc_dist < 2) {
              //   acc_dist += Math.abs(cur_r - prev_r)
              // } else {
              //   drawTraceSegment(cur_i, color); // move element down
                // acc_dist = 0
              // }
            // }

            drawTraceSegment(cur_i, color)

          // prev_r = cur_r


          }
          cur_i++;

          // console.log(interval)
          // if (interval < 1000){
          // setTimeout(() => {


        let buffer = 2//2
        if (x_end_cart > 20 + buffer || x_end_cart < -20 - buffer || y_end_cart > 40 + buffer || y_end_cart < -40 - buffer
          || Math.sqrt(x_end_cart**2 + y_end_cart**2) < 1) {
          let i = 0
          // console.log("boba")
          let ctx = canvas.getContext("2d");
          // console.log("äloha")
          while (i < 20) {
            // console.log("clearing up")
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            // ctx.fillStyle = "yellow";




            ctx.fillRect(0, 0, windowWidth, windowHeight);
            // x, y, width, height
            // fills a square in the center around the blackhole
            // ctx.fillRect(3 / 8 * windowWidth + 1, 7 / 16 * windowHeight + 1, 2/8 * windowWidth - 2, 2 / 16 * windowHeight - 2);


            redrawCanvas()
            i = i + 1;
          }
          console.log("stopping trace")
        } else {
            requestAnimationFrame(animateTrace); // queue request for next frame
        }


          // }, 200);

          // }
        });

      // console.log("done animating")
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

  let press_x
  let press_Y
    let release_x
  let releaseY

  let blackHoleX = windowWidth / 2
  let blackHoleY = windowHeight / 2

  const drawBlackHole = () => {
    // console.log("drawing bh")
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

  const drawLegend = () => {
    // console.log("drawing bh")
    let ctx = canvas.getContext("2d");

    ctx.beginPath()

    ctx.strokeStyle = '#000000';
    ctx.moveTo(6 / 8 * windowWidth, windowHeight - 100);
    ctx.lineTo(7 / 8 * windowWidth, windowHeight - 100);
    ctx.stroke();

    ctx.moveTo(6 / 8 * windowWidth, windowHeight - 105);
    ctx.lineTo(6 / 8 * windowWidth, windowHeight - 95);
    ctx.stroke();

    ctx.moveTo(7 / 8 * windowWidth, windowHeight - 105);
    ctx.lineTo(7 / 8 * windowWidth, windowHeight - 95);
    ctx.stroke();


    ctx.strokeStyle = 'black'

    ctx.fillText("5 Schwarzschild Radii [SR]", 11 / 16 * windowWidth - 5, windowHeight - 80);

    // ctx.rotate(1)
    ctx.fillText("y-axis [SR units]", 5 / 16 * windowWidth, windowHeight - 10);
    ctx.fillText("x-axis [SR units]", 13 / 16 * windowWidth, windowHeight / 2 + 20);

    ctx.closePath();


  }

  const drawCoordinateAxes = () => {
    let ctx = canvas.getContext("2d");

    ctx.beginPath()
    ctx.strokeStyle = '#000000';
    ctx.moveTo(0, blackHoleY);
    ctx.lineTo(windowWidth, blackHoleY);
    ctx.stroke();

    ctx.moveTo(blackHoleX, 0);
    ctx.lineTo(blackHoleX, windowHeight);
    ctx.stroke();

    let i = 0

    while (i <= 8) {
      ctx.moveTo(i / 8 * windowWidth, windowHeight / 2 + 5);
      ctx.lineTo(i / 8 * windowWidth, windowHeight / 2 - 5);
      ctx.stroke();
      i += 1
    }
    i = 0
    while (i <= 16) {
      ctx.moveTo(windowWidth / 2 + 5, i / 16 * windowHeight);
      ctx.lineTo(windowWidth / 2 - 5, i / 16 * windowHeight);
      ctx.stroke();
      i += 1
    }

    ctx.closePath();
  }

  // const redrawCanvas = () => {
  //   drawCoordinateAxes()
  //   drawBlackHole()
  //   drawLegend()
  // }

  const redrawCanvas = () => {
    let ctx = canvas.getContext("2d");

    // let image = new Image();
    // image.src = "./assets/2D-cart-axis.jpg";
    const image = new CanvasImage(canvas);

    const asset = Expo.Asset.fromModule(require('../assets/trans-2D-cart-axis.png'));
    image.src = asset.uri;

    ctx.drawImage(image, 0, 0, windowWidth, windowHeight);

    console.log("drew image")
  }


  const handleCanvas = (can) => {
    if (can !== null) {
      console.log("not null")
      canvas = can

      can.height = windowHeight
      can.width = windowWidth

      redrawCanvas()
    }
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
    press_x = e.nativeEvent.locationX
    press_Y = e.nativeEvent.locationY
  }

  const quadOneDeltaCalc = (pressX, releaseX, pressY, releaseY, theta, phi) => {
    let delta0
    if (releaseY > pressY && releaseX > pressX) {
        // dir up right
        delta0 = theta - phi
      } else if (releaseY > pressY && releaseX < pressX) {
        // up left
        theta = 180 - theta
        delta0 = theta - phi
        if (delta0 < 0) {
          delta0 = phi - theta
        }
      } else if (releaseY < pressY && releaseX > pressX) {
        // down right
        theta = -theta
        delta0 = -(Math.abs(theta) + phi)
      } else if (releaseY < pressY && releaseX < pressX) {
        // down left
        theta = -(180 - theta)
        console.log("theta: ", theta)
        delta0 = -(Math.abs(theta) + phi)
        if (delta0 < -180) {
          delta0 = 180 - (Math.abs(delta0) - 180)
        }
      }
    return delta0
  }

  const getDelta0 = (press_x, release_x, press_y, release_y) => {
    // console.log(pressY)
    // console.log(releaseY)
    // console.log(pressX)
    // console.log(releaseX)
    let blackHoleObj = convertPixelToCartesian(blackHoleX, blackHoleY)
    let theta // angle to line parallel to x axis
    theta = 180 / Math.PI * (Math.atan(Math.abs(press_y - release_y) / Math.abs(press_x - release_x)))
    let phi
    phi = 180 / Math.PI * (Math.atan(Math.abs(press_y - blackHoleObj.cartY) / Math.abs(Math.abs(press_x) - blackHoleObj.cartX)))

    let delta0

    if (press_x >= 0 && press_y >= 0) {
      // quadrant 1
      delta0 = quadOneDeltaCalc(press_x, release_x, press_y, release_y, theta, phi)
    } else if (press_x <= 0 && press_y >= 0) {
      // quadrant 2
      delta0 = quadOneDeltaCalc(-press_x, -release_x, press_y, release_y, theta, phi)
    } else if (press_x <= 0 && press_y <= 0) {
      // quadrant 3
      delta0 = quadOneDeltaCalc(-press_x, -release_x, -press_y, -release_y, theta, phi)
    } else {
      // quadrant 4
      delta0 = quadOneDeltaCalc(press_x, release_x, -press_y, -release_y, theta, phi)
    }



    // let negative_x
    // negative_x = x_ray < 0;
    //
    //
    //
    // // theta = 180 / Math.PI * (Math.atan(Math.abs(Math.abs(pressY) - Math.abs(releaseY)) / Math.abs(Math.abs(pressX) - Math.abs(releaseX))))
    //
    // if (pressX > releaseX) {
    //   theta = 180 - theta // since the angle we want has 0 at +ve y axis side
    // }
    //
    // if (negative_x) {
    //   theta = 180 - theta
    //   console.log("is negative")
    // } else {
    //   console.log("is positive")
    // }
    //
    // console.log("theta: ", theta)
    //
    //
    // let phi
    // phi = 180 / Math.PI * (Math.atan(Math.abs(pressY - blackHoleY) / Math.abs(Math.abs(pressX) - blackHoleX)))
    //
    // let delta0
    // if (pressY > releaseY) { // remember that lower y is towards the top
    //   // console.log("yes")
    //   delta0 = theta - phi
    // } else {
    //   delta0 = -(theta + phi)
    // }
    //
    //
    //
    //
    //

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
    // cartY = (pixelY - blackHoleY) / 10
    return {cartX: cartX, cartY: cartY}
  }

  // https://codepen.io/mradamcole/pen/yWXyPz
  const rainbowStop = (h) => {
  let f = (n, k = (n + h * 12) % 12) =>
    0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  let rgb2hex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map(x =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, 0)
      )
      .join("");
  return rgb2hex(f(0), f(8), f(4));
}

  let acc_angle = 0
  const drawTraceSegment = (i, color) => {
    // console.log(i)
    // console.log("drawing")
    let ctx = canvas.getContext("2d");

    // for (let i = 0; i < x_trace.length - 1; i++) {
    //============
    // let pixelObjStart = convertCartesianToPixel(x_trace[i], y_trace[i])
    // let pixelObjEnd = convertCartesianToPixel(x_trace[i + 1], y_trace[i + 1])
    //============

    let pixelObjStart = convertCartesianToPixel(final_x_list[i], final_y_list[i])
    let pixelObjEnd = convertCartesianToPixel(final_x_list[i + 1], final_y_list[i + 1])

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


    // ctx.fillRect(pixelObjStart.pixelX, pixelObjStart.pixelY, 10, 10);


     ctx.beginPath()
    ctx.arc(pixelObjStart.pixelX, pixelObjStart.pixelY, 5, 0, 2 * Math.PI);


    // https://www.programiz.com/javascript/examples/random-between-numbers
    // let color1 = Math.floor(Math.random() * (255 - 0 + 1)) + 255
    //   let color2 = Math.floor(Math.random() * (255 - 0 + 1)) + 255
    //   let color3 = Math.floor(Math.random() * (255 - 0 + 1)) + 255

    // ctx.fillStyle = 'rgb(255,0,0)';
    //     ctx.strokeStyle = 'rgb(255,0,0)';



        ctx.fillStyle = color;
    ctx.strokeStyle = color

    ctx.fill();
    ctx.stroke();
    ctx.closePath()

    // async function f1() {
    //   let img = await ctx.getImageData(0, 0, windowWidth, windowHeight);
    //   console.log("img: ", img)
    //   // get the image data values
    //   let imageData = img.data
    //     console.log("imageData: ", imageData)
    //   let length = imageData.length;
    //   // set every fourth value to 50
    //   for(let i=3; i < length; i+=4){
    //       imageData[i] = 50;
    //   }
    //   // after the manipulation, reset the data
    //   img.data = imageData;
    //   // and put the imagedata back to the canvas
    //   ctx.putImageData(img, 0, 0);
    //
    //   ctx.drawImage(img, 0, 0, windowWidth, windowHeight);
    //
    //   console.log("updated image")
    //
    //   redrawCanvas()
    // }
    // f1()


    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    const image = new CanvasImage(canvas);

    const asset = Expo.Asset.fromModule(require('../assets/trans-2D-cart-axis.png'));
    image.src = asset.uri;

    ctx.drawImage(image, 0, 0, windowWidth, windowHeight);

    // get the image data object
    // let img = new CanvasImage(canvas);
    //
    // const asset = Expo.Asset.fromModule(require('../assets/2D-cart-axis.jpg'));
    // img.src = asset.uri;
    //
    // console.log("img: ", img)
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
      let divisions = Math.sqrt(Math.pow((x_trace[i] - x_trace[i + 1]), 2) + Math.pow((y_trace[i] - y_trace[i + 1]), 2))
        * dist_to_div_ratio
      waypointsX = waypointsX.concat(numListRangeInclusive(x_trace[i], x_trace[i + 1], divisions))
      waypointsY = waypointsY.concat(numListRangeInclusive(y_trace[i], y_trace[i + 1], divisions))
    }

    x_trace = waypointsX
    // console.log("x_trace: ", x_trace)
    y_trace = waypointsY

    x_trace.forEach((x, i) => {
      if (periastron === null) {
        periastron = {x: x, y: y_trace[i]}
      } else {
        // console.log("periastron: ", periastron)
        let curPeriastronDist = Math.sqrt(Math.pow(periastron.x, 2) + Math.pow(periastron.y, 2))
        let candPeriastronDist = Math.sqrt(Math.pow(x, 2) + Math.pow(y_trace[i], 2))

      if (candPeriastronDist < curPeriastronDist) {
        periastron = {x: x, y: y_trace[i]}
      }
      }
    })

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

     release_x = e.nativeEvent.locationX
     releaseY = e.nativeEvent.locationY

     // let pressCoorX = pressX - blackHoleX
     // let pressCoorY = blackHoleY - pressY

     let pressCoorObj = convertPixelToCartesian(press_x, press_Y)
     let releaseCoorObj = convertPixelToCartesian(release_x, releaseY)

     let delta0 = getDelta0(pressCoorObj.cartX, releaseCoorObj.cartX, pressCoorObj.cartY, releaseCoorObj.cartY)



     requestRayTrace(pressCoorObj.cartX, pressCoorObj.cartY, delta0)
     // console.log("x_trace: ", x_trace)
     // console.log("y_trace: ", y_trace)

  }

  const [container_style, set_container_style] = useState(
    {position: 'absolute',
      zIndex:1,
    paddingTop: 50,
    width: '0%',
    height: '0%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'}
  );

  // const [titleButton, setTitleButton] = useState('Trace Analysis');
  // const [colorButton, setColorButton] = useState('#00a3ff');

  const clickAnalysisBtn = () => {
    console.log("button click")
      set_container_style({
        position: 'absolute',
        paddingTop: 50,
        width: windowWidth,
        height: (windowHeight - 5),
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      })

    setAnalysisBtnDiv(
      {
    position: 'absolute',
        height: 0,
        width: 0,
    top: windowHeight - 50,
    right: 10,
    // left: 10,
    // zIndex: -10
  }
    )

    setChartRow(
      {
    paddingTop: 50,
    position: 'absolute',
    height: windowHeight + 10,
    // flex: 1,
    width: windowWidth
  }
    )
      }


  const clickBuildBtn = () => {
    console.log("button click")
      set_container_style({
    position: 'absolute',
    paddingTop: 50,
    width: '0%',
    height: '0%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  })

    setAnalysisBtnDiv(
      {
    position: 'absolute',
    top: windowHeight - 50,
    right: 10,
    // left: 10,
    // zIndex: -10
  }
    )

    setChartRow(
      {
    paddingTop: 50,
    position: 'absolute',
    height: 0,
    // flex: 1,
    width: 0
  }
    )
    }


  // https://snack.expo.io/@rynobax/react-native-plotly-demo

//   let dataGraph = {
//   __id: 'up',
//   x: [0],
//   y: [0],
//   type: 'scatter',
//     mode: 'lines+markers'
// }

 const [dataGraph, setDataGraph] = useState()

let bounds1 = convertPixelToCartesian(0, 0)
  let bounds2 = convertPixelToCartesian(windowWidth, windowHeight)

  let density = 1000

  let theta_arr = []

        // let arr_size be 100
        let incrementor = 2 * Math.PI / (density - 1)

        let i = 0

        while (i < density) {
     theta_arr.push(incrementor * i)
          i += 1
        }

        // console.log("theta_arr: ", theta_arr)

  const create_func_arr = (func, arr) => {
          let func_arr = []

          for (let n in arr){
            func_arr.push(func(n))
          }

          return func_arr
        }


  let trace1 = {
  name: 'Black Hole',
  x: create_func_arr(Math.cos, theta_arr),
    y: create_func_arr(Math.sin, theta_arr),
  type: 'line',
    mode: 'markers',
    line: {
      color: 'black'
    },

    // markers: false,
    fill: 'toself',
    fillcolor: 'black',
}

// console.log("gigibobo: ", bounds2.cartY)

const [stateGraph, setStateGraph] = useState(
    {
    data: [trace1],
    layout: { width: windowWidth,
      height: windowHeight - 55,
      title: 'No Recent Trace to Display',
    xaxis: {
      title: "x-axis [SR Units]",
    range: [-bounds2.cartX, bounds2.cartX]
  },
      yaxis: {
      title: "y-axis [SR Units]",
    range: [-Math.abs(bounds2.cartY), Math.abs(bounds2.cartY)],
        scaleanchor:"x",
        scaleratio:1
  },
      legend: {
          yanchor:"top",
    y:0.99,
    xanchor:"left",
    x:0.01
      }


    }
  }
  );
  // = ;

  const expandManualEntryDiv = () => {

  }

  const clickManualEntryBtn = () => {
    //  if (xManual === ''){
    //   setXManual(null)
    // }
    // if (yManual === ''){
    //   setYManual(null)
    // }
    // if (delta0Manual === ''){
    //   setDelta0Manual(null)
    // }

    if (xManual === null || xManual === ''){
      setInputErrorText("x must be filled in.")
    } else if (yManual === null || yManual === ''){
      setInputErrorText("y must be filled in.")
    } else if (delta0Manual === null || delta0Manual === ''){
      setInputErrorText("delta0 must be filled in.")
    }

    else if (Math.sqrt(xManual**2 + yManual**2) < 3) {
      setInputErrorText("Light source must be outside the event horizon (r0 >= 3)")
    }

  else if (Math.abs(xManual) > 20 || Math.abs(yManual) > 40) {
      setInputErrorText("Light source must be within the range x: [-20, 20] and y: [-40, 40]")
    }

    else if (delta0Manual > 180 || delta0Manual < -180) {
      setInputErrorText("delta0 range: [-180, 180]")
    }

    else {
       console.log('x: ', xManual)
      console.log('y: ', yManual)
      console.log('delta0: ', delta0Manual)

      setInputErrorText("")

      requestRayTrace(xManual, yManual, delta0Manual)
    }
  }

  const [xManual, setXManual] = useState(null)
  const [yManual, setYManual] = useState(null)
  const [delta0Manual, setDelta0Manual] = useState(null)


  return (
    <View>
      {/*https://stackoverflow.com/questions/41948900/react-native-detect-tap-on-view*/}
      {/*onPress={canvasTap} is for just tapping*/}
      <View style={styles.canvasDiv}>
        <TouchableOpacity onPressIn={canvasPress} onPressOut={canvasRelease}>
        {/*<Text>Hi there</Text>*/}
        <Canvas ref={handleCanvas} />
      </TouchableOpacity>


        <View style={analysisBtnDiv}>
        <Button
        onPress={clickAnalysisBtn}
        title={"Trace Analysis"}
        color={'#00a3ff'}
        // accessibilityLabel="Learn more about this purple button"
      />
      </View>
      </View>


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
            placeholder='x'
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
          <Text>Start angle:</Text>
          <TextInput
            style={styles.manualTextInput}
            placeholder="delta0"
          keyboardType = 'numeric'
          value={delta0Manual}
          onChangeText={setDelta0Manual}/>

          <Button
        onPress={clickManualEntryBtn}
        title={'Trace'}
        color={'#00a3ff'}
        // accessibilityLabel="Learn more about this purple button"
      />
        </View>
    </CollapsibleView>

    <View style={styles.inputErrorTextDiv}>
        <Text style={styles.errorText}>{inputErrorText}</Text>
      </View>



      {/*<View>*/}
      {/*  <Button*/}
      {/*  onPress={clickAnalysisBuildBtn}*/}
      {/*  title={titleButton}*/}
      {/*  color={colorButton}*/}
      {/*  // accessibilityLabel="Learn more about this purple button"*/}
      {/*/>*/}
      {/*</View>*/}

      {/*<Text>Bezier Line Chart</Text>*/}
  {/*<LineChart*/}
  {/*  data={{*/}
  {/*    labels: ["January", "February", "March", "April", "May", "June"],*/}
  {/*    datasets: [*/}
  {/*      {*/}
  {/*        data: [*/}
  {/*          Math.random() * 100,*/}
  {/*          Math.random() * 100,*/}
  {/*          Math.random() * 100,*/}
  {/*          Math.random() * 100,*/}
  {/*          Math.random() * 100,*/}
  {/*          Math.random() * 100*/}
  {/*        ]*/}
  {/*      }*/}
  {/*    ]*/}
  {/*  }}*/}
  {/*  width={Dimensions.get("window").width} // from react-native*/}
  {/*  height={220}*/}
  {/*  yAxisLabel="$"*/}
  {/*  yAxisSuffix="k"*/}
  {/*  yAxisInterval={1} // optional, defaults to 1*/}
  {/*  chartConfig={{*/}
  {/*    backgroundColor: "#e26a00",*/}
  {/*    backgroundGradientFrom: "#fb8c00",*/}
  {/*    backgroundGradientTo: "#ffa726",*/}
  {/*    decimalPlaces: 2, // optional, defaults to 2dp*/}
  {/*    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,*/}
  {/*    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,*/}
  {/*    style: {*/}
  {/*      borderRadius: 16*/}
  {/*    },*/}
  {/*    propsForDots: {*/}
  {/*      r: "6",*/}
  {/*      strokeWidth: "2",*/}
  {/*      stroke: "#ffa726"*/}
  {/*    }*/}
  {/*  }}*/}
  {/*  bezier*/}
  {/*  style={{*/}
  {/*    marginVertical: 8,*/}
  {/*    borderRadius: 16*/}
  {/*  }}*/}
  {/*/>*/}
      
      {/*<MyView hide={false}>*/}
      {/*  <Text></Text>Hi*/}
      {/*</MyView>*/}

      <View style={container_style}>

        <View style={chartRow}>
          <Plotly
            data={stateGraph.data}
            layout={stateGraph.layout}
            // update={update}
            onLoad={() => console.log('loaded')}
            // debug
            // enableFullPlotly
          />
        </View>

        <View style={styles.buildBtnDiv}>
          <Button
        onPress={clickBuildBtn}
        title={"Build Traces"}
        color={'#ff6600'}
        // accessibilityLabel="Learn more about this purple button"
      />
        </View>


      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row'
  },
  manualTextInput: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 5
  },
  manualEntryDiv: {
    position: 'absolute',
    top: 50,
    left: '5%',
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
    borderRadius: 5,
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  buildBtnDiv: {
    position: 'absolute',
    top: windowHeight - 50,
    right: 10,
    // left: 10,
    // zIndex: -10
  },
  canvasDiv: {
    position: 'absolute',
    top: 0,
  },
  inputErrorTextDiv: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    width: 2 * windowWidth / 5 ,
    backgroundColor: 'rgba(255,255,255, 0)',
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

export default Trace2D;
