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

function Guide(props) {

  if (props.visible === false) {
    return (
    <View>
    </View>
  );
  }

  return (
  //   regarding the ordering of stuff within the html:
  // https://stackoverflow.com/questions/34139687/react-native-touchableopacity-wrapping-floating-button-get-nothing
    <View>
      <View style={styles.titleContainer}>

        <Text style={styles.h1}>2D Trace</Text>
        <Text style={styles.h2}>Drag Input</Text>

        <Text>Rest your finger on the screen. This point will be the source of your desired ray.</Text>
        <Text>Drag your finger to any other point on the screen. This will determine the initial angle of the trajectory with respect to the ray source.</Text>

        <Text style={styles.h2}>Manual Input</Text>

        <Text>Expand the Manual Entry Drop down. The cartesian plan is divided such that the black hole is situated at the origin.</Text>

        <Text>The width of the screen spans +/- 40, and the height of the screen spans +/- 40.</Text>

        <Text style={styles.h2}>Analysis Mode</Text>

        <Text>Click on the Trace Analysis button, which will give a detailed plot of the ray and it's trajectory.</Text>

        <Text></Text>

        <Text style={styles.h1}>3D Trace</Text>

        <Text style={styles.h2}>Manual Input</Text>

        <Text>Make sure that input values satisfy this constraint in accordance with direction cosines: alpha0^2 + beta0^2 + gamma0^2 = 1</Text>

      </View>
    </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  h1: {
    fontSize: 30
  },

  h2: {
    fontSize: 22

  },
  bold: {
      // flex: 1,
      fontWeight: 'bold'
  },
  italics: {
      // flex: 1,
      fontStyle: 'italic'
  },
  titleContainer: {
      // flex: 1,
    position: 'absolute',
    width: 350,
    top: windowHeight / 10,
      // height: 200,
    left: (windowWidth / 2) - (350 / 2),
      // textAlign: 'center',
      // backgroundColor: 'grey',
      // justifyContent: 'center',
      // alignItems: 'center',
      // fontSize: 2900,
      // fontWeight: 'bold'
  }
});

export default Guide;
