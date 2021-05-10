import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Trace2D from './Screens/Trace2D';
import Trace3D from "./Screens/Trace3D";
import Landing from "./Screens/Landing";


export default function App() {
  return (
    <View>

      <Landing/>
      {/*<Trace2D/>*/}
      {/*<Trace3D/>*/}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    position: 'absolute',
    top: 50,
    left: 50,
  }
});
