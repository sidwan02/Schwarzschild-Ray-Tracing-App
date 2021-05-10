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



function Trace3D(props) {

  if (props.visible === false) {
   return (
    <View>
    </View>
  )
  }

  return (
    <View>
      <Text>Hello</Text>
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
