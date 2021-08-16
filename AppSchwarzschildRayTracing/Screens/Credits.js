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

function Credits(props) {

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
      {/*  <Button*/}
      {/*  title="Schwarzchild Ray Tracing"*/}
      {/*  color="black"*/}
      {/*  // accessibilityLabel="Learn more about this purple button"*/}
      {/*/>*/}
        <Text style={styles.bold}>Authors:</Text>
          <Text>Siddharth Diwan</Text>
        <Text style={styles.italics}>Brown University '24</Text>
        <Text></Text>
        <Text>Professor Dipankar Maitra</Text>
        <Text style={styles.italics}>Associate Professor of Physics/Astronomy, Wheaton College Massachusetts</Text>
      </View>

    </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
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

export default Credits;
