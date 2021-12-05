import React, { useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  Button,
  TextInput,
  Image,
} from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import axios from 'axios';

import Plotly from 'react-native-plotly';
import CollapsibleView from '@eliav2/react-native-collapsible-view';

import * as Expo from 'expo-asset';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let randomFlag = true;

let currentlyDrawing = false;
let canvas2 = null;
let canvas = null;

function Trace2D(props) {
  let thingy = 0;
  if (props.visible === false) {
    return <View></View>;
  }

  let manualTrace = false;

  let x_trace = [];
  let y_trace = [];

  const [loadingDivStyle, setLoadingDivStyle] = useState({
    top: windowHeight,
    width: 0,
    // width: windowWidth,
    display: 'flex',
    left: windowWidth / 2 - 88,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    // padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  });

  const [inputErrorText, setInputErrorText] = useState('');

  const [analysisBtnDiv, setAnalysisBtnDiv] = useState({
    position: 'absolute',
    top: windowHeight - 50,
    right: 10,
  });

  let final_x_list = [];
  let final_y_list = [];

  let periastron = null;

  const [chartRow, setChartRow] = useState({
    // paddingTop: 50,
    // position: 'absolute',
    // height: 0,
    // width: 0,
    paddingTop: 50,
    position: 'absolute',
    height: windowHeight + 10,
    width: windowWidth,
  });

  const requestRayTrace = (x, y, delta0) => {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    setInputErrorText('');
    currentlyDrawing = true;
    showLoadingDiv();

    if (delta0 < 0) {
      delta0 = delta0; // integral
    }

    const toSend = {
      x0: Math.abs(x),
      y0: Math.abs(y),
      delta0: delta0,
    };

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    axios
      .post(
        'https://schwarzschild-ray-tracing-api.herokuapp.com/2D/',
        toSend,
        config
      )
      .then((response) => {
        if (response.data === null) {
        }
        let data;

        if (typeof response.data === 'object') {
          data = response.data;
        } else {
          data = JSON.parse(response.data);
        }

        if (x >= 0 && y >= 0) {
          // https://stackoverflow.com/questions/35969974/foreach-is-not-a-function-error-with-javascript-array
          Array.prototype.forEach.call(data, (obj) => {
            x_trace.push(obj['x']);
            y_trace.push(obj['y']);
          });
        } else if (x < 0 && y >= 0) {
          // quad 2
          Array.prototype.forEach.call(data, (obj) => {
            x_trace.push(-obj['x']);
            y_trace.push(obj['y']);
          });
        } else if (x < 0 && y < 0) {
          // quad 3
          Array.prototype.forEach.call(data, (obj) => {
            x_trace.push(-obj['x']);
            y_trace.push(-obj['y']);
          });
        } else if (x >= 0 && y < 0) {
          // quad 4
          Array.prototype.forEach.call(data, (obj) => {
            x_trace.push(obj['x']);
            y_trace.push(-obj['y']);
          });
        }

        let flag_no_periastron = false;

        let c = 0;

        x_trace.forEach((x, i) => {
          if (periastron === null) {
            periastron = { x: x, y: y_trace[i] };
          } else {
            let curPeriastronDist = Math.sqrt(
              Math.pow(periastron.x, 2) + Math.pow(periastron.y, 2)
            );
            let candPeriastronDist = Math.sqrt(
              Math.pow(x, 2) + Math.pow(y_trace[i], 2)
            );

            if (
              candPeriastronDist.toFixed(5) === curPeriastronDist.toFixed(5)
            ) {
              c += 1;
              if (c === 5) {
                flag_no_periastron = true;
              }
            } else if (candPeriastronDist < curPeriastronDist) {
              periastron = { x: x, y: y_trace[i] };
              c = 0;
            }
          }
        });

        let trace1 = {
          name: 'Ray Trace',
          x: x_trace,
          y: y_trace,
          type: 'scatter',
          mode: 'lines',
        };

        let trace2 = {
          name: 'Black Hole',
          x: create_func_arr(Math.cos, theta_arr),
          y: create_func_arr(Math.sin, theta_arr),
          type: 'line',
          mode: 'markers',
          line: {
            color: 'black',
          },
          fill: 'toself',
          fillcolor: 'black',
        };

        let trace3 = {
          name: 'Periastron',
          x: [periastron.x],
          y: [periastron.y],
          type: 'scatter',
          mode: 'markers',
        };

        if (typeof delta0 === 'string') {
          delta0 = parseInt(delta0);
        }

        if (flag_no_periastron) {
          setStateGraph({
            data: [trace1, trace2],
            layout: {
              width: windowWidth,
              height: windowHeight - 55,
              title:
                'Ray Trace from (' +
                x_trace[0].toFixed(2) +
                ', ' +
                y_trace[0].toFixed(2) +
                ') <br>with initial angle ' +
                delta0.toFixed(2) +
                '°',
              xaxis: {
                title: 'x-axis [SR Units]',
                range: [-bounds2.cartX, bounds2.cartX],
              },
              yaxis: {
                title: 'y-axis [SR Units]',
                range: [-Math.abs(bounds2.cartY), Math.abs(bounds2.cartY)],
                scaleanchor: 'x',
                scaleratio: 1,
              },
              legend: {
                yanchor: 'top',
                y: 0.99,
                xanchor: 'left',
                x: 0.01,
              },
            },
          });
        } else {
          setStateGraph({
            data: [trace1, trace2, trace3],
            layout: {
              width: windowWidth,
              height: windowHeight - 55,
              title:
                'Ray Trace from (' +
                x_trace[0].toFixed(2) +
                ', ' +
                y_trace[0].toFixed(2) +
                ') <br>with initial angle ' +
                delta0.toFixed(2) +
                '°',
              xaxis: {
                title: 'x-axis [SR Units]',
                range: [-bounds2.cartX, bounds2.cartX],
              },
              yaxis: {
                title: 'y-axis [SR Units]',
                range: [-Math.abs(bounds2.cartY), Math.abs(bounds2.cartY)],
                scaleanchor: 'x',
                scaleratio: 1,
              },
              legend: {
                yanchor: 'top',
                y: 0.99,
                xanchor: 'left',
                x: 0.01,
              },
            },
          });
        }

        console.log('manualTrace: ', manualTrace);
        if (manualTrace) {
          let delta_x = x_trace[1] - x_trace[0];
          let delta_y = y_trace[1] - y_trace[0];

          while (Math.pow(delta_x, 2) + Math.pow(delta_y, 2) < 9) {
            delta_x += delta_x;
            delta_y += delta_y;
          }

          const ans = convertCartesianToPixel(
            x_trace[0] + delta_x,
            y_trace[0] + delta_y
          );

          release_x = ans.pixelX;
          releaseY = ans.pixelY;

          const ans2 = convertCartesianToPixel(xManual, yManual);
          press_x = ans2.pixelX;
          press_Y = ans2.pixelY;
        }

        let max_i = x_trace.length - 1;
        let cur_i = 0;

        prev_x = 0;
        prev_y = 0;

        let target_length = 0;

        x_trace.forEach((x_val, i) => {
          let y_val = y_trace[i];
          if (i === 0) {
            prev_x = x_val;
            prev_y = y_val;
          } else {
            let cur_r = Math.sqrt(
              (x_val - prev_x) ** 2 + (y_val - prev_y) ** 2
            );
            if (cur_r >= target_length) {
              target_length = cur_r;
            }
            prev_x = x_val;
            prev_y = y_val;
          }
        });

        target_length = Math.min(target_length, 0.4);

        // essentially if we go above the threshold we pick the point immediately before so this threshold is guaranteed to be the upper bound
        // the prev and from are different because the from changes only when you add a new point whereas the prev simply refers to the prev point with reference to x_val and y_val.
        let prev_x = 0;
        let prev_y = 0;

        let from_x = 0;
        let from_y = 0;

        x_trace.forEach((x_val, i) => {
          let y_val = y_trace[i];
          if (i === 0) {
            from_x = x_val;
            from_y = y_val;

            final_x_list.push(x_val);
            final_y_list.push(y_val);
            prev_x = x_val;
            prev_y = y_val;
          } else {
            if (
              Math.sqrt((x_val - from_x) ** 2 + (y_val - from_y) ** 2) >=
              target_length
            ) {
              final_x_list.push(prev_x);
              final_y_list.push(prev_y);

              from_x = x_val;
              from_y = y_val;

              prev_x = x_val;
              prev_y = y_val;
            } else {
              prev_x = x_val;
              prev_y = y_val;
            }
          }
        });

        let colorStop = Math.random();

        let color = rainbowStop(colorStop);

        requestAnimationFrame(function animateTrace() {
          thingy += 1;
          let x_end_cart = final_x_list[cur_i + 1],
            y_end_cart = final_y_list[cur_i + 1];

          if (cur_i < max_i) {
            drawTraceSegment(cur_i, color);
          }
          cur_i++;

          let buffer = 2; //2
          if (
            x_end_cart > 10 + buffer ||
            x_end_cart < -10 - buffer ||
            y_end_cart > 18 + buffer ||
            y_end_cart < -18 - buffer ||
            Math.sqrt(x_end_cart ** 2 + y_end_cart ** 2) < 1
          ) {
            let i = 0;

            let ctx = canvas.getContext('2d');

            while (i < 20) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

              ctx.fillRect(0, 0, windowWidth, windowHeight);

              redrawCanvas();
              i = i + 1;
            }
          } else {
            requestAnimationFrame(animateTrace); // queue request for next frame
          }
        });

        setTimeout(function () {
          currentlyDrawing = false;
          setInputErrorText('');
          hideLoadingDiv();
        }, 8000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  let press_x;
  let press_Y;
  let release_x;
  let releaseY;

  // let

  let blackHoleX = windowWidth / 2;
  let blackHoleY = windowHeight / 2;

  const drawBlackHole = () => {
    let ctx = canvas.getContext('2d');

    // black hole
    ctx.beginPath();
    ctx.arc(blackHoleX, blackHoleY, 25, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeStyle = '#000000';

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  };

  const drawRaySourceAndDelta0 = () => {
    let ctx = canvas.getContext('2d');

    // console.log('press_x:', press_x);
    // console.log('press_Y:', press_Y);

    // console.log('release_x:', release_x);
    // console.log('releaseY:', releaseY);

    ctx.beginPath();
    ctx.arc(press_x, press_Y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.strokeStyle = '#000000';

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    canvas_arrow(ctx, press_x, press_Y, release_x, releaseY);
  };

  const canvas_arrow = (ctx, fromx, fromy, tox, toy) => {
    ctx.beginPath();

    let headlen = 10; // length of head in pixels
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );

    ctx.stroke();
    ctx.closePath();
  };

  const drawLegend = () => {
    let ctx = canvas.getContext('2d');

    ctx.beginPath();

    ctx.strokeStyle = '#000000';
    ctx.moveTo((6 / 8) * windowWidth, windowHeight - 100);
    ctx.lineTo((7 / 8) * windowWidth, windowHeight - 100);
    ctx.stroke();

    ctx.moveTo((6 / 8) * windowWidth, windowHeight - 105);
    ctx.lineTo((6 / 8) * windowWidth, windowHeight - 95);
    ctx.stroke();

    ctx.moveTo((7 / 8) * windowWidth, windowHeight - 105);
    ctx.lineTo((7 / 8) * windowWidth, windowHeight - 95);
    ctx.stroke();

    ctx.strokeStyle = 'black';

    ctx.fillText(
      '2 Gravitational Units [R_G]',
      (11 / 16) * windowWidth - 5,
      windowHeight - 80
    );

    ctx.fillText('y-axis [R_G]', (5 / 16) * windowWidth, windowHeight - 10);
    ctx.fillText(
      'x-axis [R_G]',
      (13 / 16) * windowWidth,
      windowHeight / 2 + 20
    );

    ctx.closePath();
  };

  const drawCoordinateAxes = () => {
    let ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.moveTo(0, blackHoleY);
    ctx.lineTo(windowWidth, blackHoleY);
    ctx.stroke();

    ctx.moveTo(blackHoleX, 0);
    ctx.lineTo(blackHoleX, windowHeight);
    ctx.stroke();

    let i = 0;

    while (i <= 8) {
      ctx.moveTo((i / 8) * windowWidth, windowHeight / 2 + 5);
      ctx.lineTo((i / 8) * windowWidth, windowHeight / 2 - 5);
      ctx.stroke();
      i += 1;
    }
    i = 0;
    while (i <= 16) {
      ctx.moveTo(windowWidth / 2 + 5, (i / 16) * windowHeight);
      ctx.lineTo(windowWidth / 2 - 5, (i / 16) * windowHeight);
      ctx.stroke();
      i += 1;
    }

    ctx.closePath();
  };

  const drawBg2 = () => {
    let ctx = canvas2.getContext('2d');

    const image = new CanvasImage(canvas2);

    const asset = Expo.Asset.fromModule(
      require('../assets/trans-2D-cart-axis.png')
    );
    image.src = asset.uri;

    ctx.drawImage(image, 0, 0, windowWidth, windowHeight);
  };

  const drawBg = () => {
    let ctx = canvas.getContext('2d');

    const image = new CanvasImage(canvas);

    const asset = Expo.Asset.fromModule(
      require('../assets/trans-2D-cart-axis.png')
    );
    image.src = asset.uri;

    ctx.drawImage(image, 0, 0, windowWidth, windowHeight);
  };

  const redrawCanvas = () => {
    drawRaySourceAndDelta0();
  };

  const handleCanvas = (can) => {
    if (can !== null) {
      if (canvas !== can) {
        canvas = can;
        can.height = windowHeight;
        can.width = windowWidth;
      }
    }
  };

  const handleCanvas2 = (can) => {
    if (can !== null) {
      if (canvas2 !== can) {
        canvas2 = can;
        can.height = windowHeight;
        can.width = windowWidth;
      }

      let ctx = can.getContext('2d');
      if (!(can instanceof Canvas)) {
        return;
      }

      const image = new CanvasImage(can);

      const asset = Expo.Asset.fromModule(
        require('../assets/trans-2D-cart-axis.png')
      );
      image.src = asset.uri;

      ctx.drawImage(image, 0, 0, windowWidth, windowHeight);
    }

    drawCoordinateAxes();
    drawLegend();
    drawBlackHole();
  };

  const canvasPress = (e) => {
    // https://stackoverflow.com/questions/36862765/react-native-get-the-coordinates-of-my-touch-event

    press_x = e.nativeEvent.locationX;
    press_Y = e.nativeEvent.locationY;
  };

  const quadOneDeltaCalc = (pressX, releaseX, pressY, releaseY, theta, phi) => {
    let delta0;
    if (releaseY > pressY && releaseX > pressX) {
      // dir up right
      delta0 = theta - phi;
    } else if (releaseY > pressY && releaseX < pressX) {
      // up left
      theta = 180 - theta;
      delta0 = theta - phi;
      if (delta0 < 0) {
        delta0 = phi - theta;
      }
    } else if (releaseY < pressY && releaseX > pressX) {
      // down right
      theta = -theta;
      delta0 = -(Math.abs(theta) + phi);
    } else if (releaseY < pressY && releaseX < pressX) {
      // down left
      theta = -(180 - theta);
      delta0 = -(Math.abs(theta) + phi);
      if (delta0 < -180) {
        delta0 = 180 - (Math.abs(delta0) - 180);
      }
    }
    return delta0;
  };

  const getDelta0 = (press_x, release_x, press_y, release_y) => {
    let blackHoleObj = convertPixelToCartesian(blackHoleX, blackHoleY);
    let theta; // angle to line parallel to x axis
    theta =
      (180 / Math.PI) *
      Math.atan(Math.abs(press_y - release_y) / Math.abs(press_x - release_x));
    let phi;
    phi =
      (180 / Math.PI) *
      Math.atan(
        Math.abs(press_y - blackHoleObj.cartY) /
          Math.abs(Math.abs(press_x) - blackHoleObj.cartX)
      );

    let delta0;

    if (press_x >= 0 && press_y >= 0) {
      // quadrant 1
      delta0 = quadOneDeltaCalc(
        press_x,
        release_x,
        press_y,
        release_y,
        theta,
        phi
      );
    } else if (press_x <= 0 && press_y >= 0) {
      // quadrant 2
      delta0 = quadOneDeltaCalc(
        -press_x,
        -release_x,
        press_y,
        release_y,
        theta,
        phi
      );
    } else if (press_x <= 0 && press_y <= 0) {
      // quadrant 3
      delta0 = quadOneDeltaCalc(
        -press_x,
        -release_x,
        -press_y,
        -release_y,
        theta,
        phi
      );
    } else {
      // quadrant 4
      delta0 = quadOneDeltaCalc(
        press_x,
        release_x,
        -press_y,
        -release_y,
        theta,
        phi
      );
    }

    return delta0;
  };

  const convertCartesianToPixel = (cartX, cartY) => {
    let pixelX, pixelY;
    pixelX = cartX * 25 + blackHoleX;
    pixelY = blackHoleY - cartY * 25;
    return { pixelX: pixelX, pixelY: pixelY };
  };

  const convertPixelToCartesian = (pixelX, pixelY) => {
    let cartX, cartY;
    cartX = (pixelX - blackHoleX) / 25;
    cartY = (blackHoleY - pixelY) / 25;
    return { cartX: cartX, cartY: cartY };
  };

  // https://codepen.io/mradamcole/pen/yWXyPz
  const rainbowStop = (h) => {
    let f = (n, k = (n + h * 12) % 12) =>
      0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    let rgb2hex = (r, g, b) =>
      '#' +
      [r, g, b]
        .map((x) =>
          Math.round(x * 255)
            .toString(16)
            .padStart(2, 0)
        )
        .join('');
    return rgb2hex(f(0), f(8), f(4));
  };

  const drawTraceSegment = (i, color) => {
    let ctx = canvas.getContext('2d');

    let pixelObjStart = convertCartesianToPixel(
      final_x_list[i],
      final_y_list[i]
    );
    let pixelObjEnd = convertCartesianToPixel(
      final_x_list[i + 1],
      final_y_list[i + 1]
    );

    ctx.fillStyle = 'black';

    ctx.beginPath();
    ctx.arc(pixelObjStart.pixelX, pixelObjStart.pixelY, 5, 0, 2 * Math.PI);

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, windowWidth, windowHeight);

    ctx.closePath();
    redrawCanvas();
  };

  const canvasRelease = (e) => {
    if (currentlyDrawing) {
      setInputErrorText('Please wait for current trace to render');
    } else {
      x_trace = [];
      y_trace = [];

      release_x = e.nativeEvent.locationX;
      releaseY = e.nativeEvent.locationY;

      let pressCoorObj = convertPixelToCartesian(press_x, press_Y);
      let releaseCoorObj = convertPixelToCartesian(release_x, releaseY);

      let delta0 = getDelta0(
        pressCoorObj.cartX,
        releaseCoorObj.cartX,
        pressCoorObj.cartY,
        releaseCoorObj.cartY
      );

      if (delta0 === undefined) {
        delta0 = 90;
      }

      let ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, windowWidth, windowHeight);

      if (Math.sqrt(pressCoorObj.cartX ** 2 + pressCoorObj.cartY ** 2) < 3) {
        setInputErrorText(
          'Light source must be outside the event horizon (r0 >= 3)'
        );
      } else {
        // currentlyDrawing = true;
        manualTrace = false;
        // redrawCanvas();
        requestRayTrace(pressCoorObj.cartX, pressCoorObj.cartY, delta0);
      }
    }
  };

  const [container_style, set_container_style] = useState({
    width: '0%',
    height: '0%',
    top: windowHeight,
  });

  const clickAnalysisBtn = () => {
    console.log('setting container style');
    set_container_style({
      position: 'absolute',
      paddingTop: 50,
      width: windowWidth,
      height: windowHeight - 5,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    });

    setAnalysisBtnDiv({
      position: 'absolute',
      height: 0,
      width: 0,
      top: windowHeight - 50,
      right: 10,
    });

    setChartRow({
      paddingTop: 50,
      position: 'absolute',
      height: windowHeight + 10,
      width: windowWidth,
    });
  };

  const clickBuildBtn = () => {
    set_container_style({
      width: '0%',
      height: '0%',
      top: windowHeight,
    });

    setAnalysisBtnDiv({
      position: 'absolute',
      top: windowHeight - 50,
      right: 10,
    });

    // setChartRow({
    //   paddingTop: 50,
    //   position: 'absolute',
    //   height: 0,
    //   width: 0,
    // });
  };

  let bounds1 = convertPixelToCartesian(0, 0);
  let bounds2 = convertPixelToCartesian(windowWidth, windowHeight);

  let density = 1000;

  let theta_arr = [];

  // let arr_size be 100
  let incrementor = (2 * Math.PI) / (density - 1);

  let i = 0;

  while (i < density) {
    theta_arr.push(incrementor * i);
    i += 1;
  }

  const create_func_arr = (func, arr) => {
    let func_arr = [];

    for (let n in arr) {
      func_arr.push(func(n));
    }

    return func_arr;
  };

  let trace1 = {
    name: 'Black Hole',
    x: create_func_arr(Math.cos, theta_arr),
    y: create_func_arr(Math.sin, theta_arr),
    type: 'line',
    mode: 'markers',
    line: {
      color: 'black',
    },

    fill: 'toself',
    fillcolor: 'black',
  };

  const [stateGraph, setStateGraph] = useState({
    data: [trace1],
    layout: {
      width: windowWidth,
      height: windowHeight - 55,
      title: 'No Recent Trace to Display',
      xaxis: {
        title: 'x-axis [SR Units]',
        range: [-bounds2.cartX, bounds2.cartX],
      },
      yaxis: {
        title: 'y-axis [SR Units]',
        range: [-Math.abs(bounds2.cartY), Math.abs(bounds2.cartY)],
        scaleanchor: 'x',
        scaleratio: 1,
      },
      legend: {
        yanchor: 'top',
        y: 0.99,
        xanchor: 'left',
        x: 0.01,
      },
    },
  });

  const clickManualEntryBtn = () => {
    if (xManual === null || xManual === '') {
      setInputErrorText('x must be filled in.');
    } else if (yManual === null || yManual === '') {
      setInputErrorText('y must be filled in.');
    } else if (delta0Manual === null || delta0Manual === '') {
      setInputErrorText('delta0 must be filled in.');
    } else if (isNaN(parseFloat(xManual))) {
      setInputErrorText('x must be a real number.');
    } else if (isNaN(parseFloat(yManual))) {
      setInputErrorText('y must be a real number.');
    } else if (isNaN(parseFloat(delta0Manual))) {
      setInputErrorText('delta0 must be a real number.');
    } else if (Math.sqrt(xManual ** 2 + yManual ** 2) < 3) {
      setInputErrorText(
        'Light source must be outside the event horizon (r0 >= 3)'
      );
    } else if (Math.abs(xManual) > 20 || Math.abs(yManual) > 40) {
      setInputErrorText(
        'Light source must be within the range x: [-20, 20] and y: [-40, 40]'
      );
    } else if (delta0Manual > 180 || delta0Manual < -180) {
      setInputErrorText('delta0 range: [-180, 180]');
    } else if (currentlyDrawing) {
      setInputErrorText('Please wait for current trace to render');
    } else {
      setInputErrorText('');
      currentlyDrawing = true;

      manualTrace = true;

      // drawRaySourceAndDelta0();
      requestRayTrace(xManual, yManual, delta0Manual);
    }
  };

  const showLoadingDiv = () => {
    setLoadingDivStyle({
      top: windowHeight,
      width: 150,
      display: 'flex',
      left: windowWidth / 2 - 88,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    });
  };

  const hideLoadingDiv = () => {
    setLoadingDivStyle({
      top: windowHeight,
      width: 0,
      display: 'flex',
      left: windowWidth / 2 - 88,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      alignItems: 'center',
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    });
  };

  const [xManual, setXManual] = useState(null);
  const [yManual, setYManual] = useState(null);
  const [delta0Manual, setDelta0Manual] = useState(null);

  return (
    <View>
      {/*https://stackoverflow.com/questions/41948900/react-native-detect-tap-on-view*/}
      {/*onPress={canvasTap} is for just tapping*/}
      <View style={styles.canvasDiv}>
        <TouchableOpacity onPressIn={canvasPress} onPressOut={canvasRelease}>
          <Canvas ref={handleCanvas} />
          <Canvas ref={handleCanvas2} style={styles.thingDiv} />
        </TouchableOpacity>

        <View style={analysisBtnDiv}>
          <Button
            onPress={clickAnalysisBtn}
            title={'Trace Analysis'}
            color={'#00a3ff'}
          />
        </View>
      </View>

      <CollapsibleView title="Manual Entry" style={styles.manualEntryDiv}>
        <View>
          <Text>x [R_G]:</Text>
          <TextInput
            style={styles.manualTextInput}
            placeholder="x coordinate of light source"
            keyboardType="numeric"
            value={xManual}
            onChangeText={setXManual}
          />
          <Text>y [R_G]:</Text>
          <TextInput
            style={styles.manualTextInput}
            placeholder="y coordinate of light source"
            keyboardType="numeric"
            value={yManual}
            onChangeText={setYManual}
          />
          <Text>delta0 [°]:</Text>
          <TextInput
            style={styles.manualTextInput}
            placeholder="Initial angle of ray to light src position vector"
            keyboardType="numeric"
            value={delta0Manual}
            onChangeText={setDelta0Manual}
          />

          <Button
            onPress={clickManualEntryBtn}
            title={'Trace'}
            color={'#00a3ff'}
          />
        </View>
      </CollapsibleView>

      <View style={styles.inputErrorTextDiv}>
        <Text style={styles.errorText}>{inputErrorText}</Text>
      </View>

      <View style={loadingDivStyle}>
        <View style={styles.inline}>
          <Text>Tracing</Text>
          <Image
            source={require('../assets/loading.gif')}
            style={{
              width: 35,
              height: 35,
              resizeMode: 'contain',
            }}
          />
          <Text>Ray</Text>
        </View>
      </View>

      <View style={container_style}>
        <View style={chartRow}>
          <Plotly
            data={stateGraph.data}
            layout={stateGraph.layout}
            // onLoad={() => console.log('loaded')}
          />
        </View>

        <View style={styles.buildBtnDiv}>
          <Button
            onPress={clickBuildBtn}
            title={'Build Traces'}
            color={'#ff6600'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
  },
  manualTextInput: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 5,
  },
  manualEntryDiv: {
    position: 'absolute',
    width: windowWidth * 0.85,
    top: 70,
    left: '5%',
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
    borderRadius: 5,
  },
  buildBtnDiv: {
    position: 'absolute',
    // zIndex: -100,
    top: windowHeight - 50,
    right: 10,
  },
  canvasDiv: {
    // display: 'flex',
    position: 'absolute',
    top: 0,
  },
  thingDiv: {
    position: 'absolute',
    top: 0,
  },
  inputErrorTextDiv: {
    position: 'absolute',
    top: 30,
    left: 10,
    width: windowWidth - 20,
    padding: 10,
    borderRadius: 5,
  },

  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  errorText: {
    color: 'red',
  },
  container: {
    position: 'absolute',
    paddingTop: 50,
    width: '0%',
    height: '0%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Trace2D;
