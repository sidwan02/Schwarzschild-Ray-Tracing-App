import React, {useState} from 'react'
import {StyleSheet, Dimensions, TouchableOpacity, View, Text, Button, TextInput} from 'react-native';
import Canvas from 'react-native-canvas';
import axios from 'axios';
import AwesomeButton from "react-native-really-awesome-button-fixed";
// import Button from "react-native-really-awesome-button-fixed";
// import { LineChart, XAxis, YAxis, Grid } from 'react-native-svg-charts'
import Plotly from 'react-native-plotly';
import CollapsibleView from "@eliav2/react-native-collapsible-view";
// import MyView from "../Components/MyView";
import Trace2D from "./Trace2D";
import Trace3D from "./Trace3D";

function Landing() {



  return (
    <View>
      <View style={styles.btn1Container}>
        <Button
          // onclick={}
        title="2D Trace"
        color="green"
        // accessibilityLabel="Learn more about this purple button"
      />
      </View>

      <View style={styles.btn2Container}>
        <Button
          // onclick={}
        title="3D Trace"
        color="green"
        // accessibilityLabel="Learn more about this purple button"
      />
      </View>
      {/*<Trace2D/>*/}
      {/*<Trace3D/>*/}
    </View>
  )
}
const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  btn1Container: {
    position: 'absolute',
    width: 200,
    top: 2 * windowHeight / 5,
    left: (windowWidth / 2) - (200 / 2),
  },
  btn2Container: {
    position: 'absolute',
    width: 200,
    top: 3 * windowHeight / 5,
    left: (windowWidth / 2) - (200 / 2),
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

export default Landing;
