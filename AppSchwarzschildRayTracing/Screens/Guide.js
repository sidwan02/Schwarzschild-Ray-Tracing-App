import React, {useState} from 'react'
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView
} from 'react-native';
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
//     <ScrollView contentContainerStyle={{flex: 1}}>
//       <View style={styles.titleContainer}>
//
//         <CollapsibleView title="2D Trace">
//
//           <CollapsibleView title="Drag Input">
//             <Text>Rest your finger on the screen. This point will be the source of your desired ray.</Text>
//             <Text></Text>
//         <Text>Drag your finger to any other point on the screen. This will determine the initial angle of the trajectory with respect to the ray source.</Text>
//           </CollapsibleView>
//
//           <CollapsibleView title="Manual Input">
//             <Text>Expand the Manual Entry Drop down. The cartesian plan is divided such that the black hole is situated at the origin.</Text>
// <Text></Text>
//         <Text>The width of the screen spans +/- 20, and the height of the screen spans +/- 40.</Text>
//             <Text></Text>
//         <Text>Note that delta0 is defined to be anti-clockwise angle formed by the position vector of the ray source and the initial direction of the ray. </Text>
//           </CollapsibleView>
//
//                   <CollapsibleView title="Analysis Mode">
//               <Text>Click on the Trace Analysis button, which will give a detailed plot of the ray and it's trajectory.</Text>
//           </CollapsibleView>
//     </CollapsibleView>
//
//         <CollapsibleView title="3D Trace">
//            <CollapsibleView title="Manual Input">
//              <Text>Note that alpha0, beta0 and gamma0 must be degree angles</Text>
// <Text></Text>
//         <Text>Make sure that input values satisfy the following constraint in accordance with direction cosines: cos(l)^2 + cos(m)^2 + cos(n)^2 = 1 where l, m and n correspond to the converted forms of alpha0, beta0 and gamma0 into radians.</Text>
// <Text></Text>
//         <Text>Note that you can input any two of alpha0, beta0 and gamma0. The third will be automatically populated if possible.</Text>
//            </CollapsibleView>
//         </CollapsibleView>
//
//       </View>
//     </ScrollView>

    <ScrollView style={styles.container}>

      <CollapsibleView title="2D Trace">

           <CollapsibleView title="Drag Input">
             <Text>Rest your finger on the screen. This point will be the source of your desired ray.</Text>
             <Text></Text>
         <Text>Drag your finger to any other point on the screen. This will determine the initial angle of the trajectory with respect to the ray source.</Text>
           </CollapsibleView>

           <CollapsibleView title="Manual Input">
             <Text>Expand the Manual Entry Drop down. The cartesian plan is divided such that the black hole is situated at the origin.</Text>
 <Text></Text>
         <Text>The width of the screen spans +/- 20, and the height of the screen spans +/- 40.</Text>
             <Text></Text>
         <Text>Note that delta0 is defined to be anti-clockwise angle formed by the position vector of the ray source and the initial direction of the ray. </Text>
           </CollapsibleView>

                  <CollapsibleView title="Analysis Mode">
               <Text>Click on the Trace Analysis button, which will give a detailed plot of the ray and it's trajectory.</Text>
           </CollapsibleView>
     </CollapsibleView>

         <CollapsibleView title="3D Trace">
            <CollapsibleView title="Manual Input">
              <Text>Note that alpha0, beta0 and gamma0 must be degree angles</Text>
 <Text></Text>
         <Text>Make sure that input values satisfy the following constraint in accordance with direction cosines: cos(l)^2 + cos(m)^2 + cos(n)^2 = 1 where l, m and n correspond to the converted forms of alpha0, beta0 and gamma0 into radians.</Text>
 <Text></Text>
         <Text>Note that you can input any two of alpha0, beta0 and gamma0. The third will be automatically populated if possible.</Text>
            </CollapsibleView>
         </CollapsibleView>
   </ScrollView>
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
  },
  container: {
    // flex: 1,
    paddingTop: StatusBar.currentHeight + 25,
    height: windowHeight,
    width: windowWidth,
    position: 'absolute',
  },
});

export default Guide;
