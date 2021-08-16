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
import Credits from "./Credits";

function Landing() {
  const [titleContainer, setTitleContainer] = useState(
    {
      // flex: 1,
    position: 'absolute',
    width: 400,
    top: windowHeight / 10,
      height: 200,
    left: (windowWidth / 2) - (400 / 2),
      textAlign: 'center',
      backgroundColor: 'grey',
      justifyContent: 'center'
  }
  );

  const titleTextContainer = useState(
    {
      textAlign: 'center',
      backgroundColor: 'grey',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 30,
      fontWeight: 'bold'
  }
  );

  const [creditsBtnContainer, setCreditsBtnContainer] = useState(
    {
      // flex: 1,
    position: 'absolute',
    width: 100,
    top: windowHeight - 50,
    left: (windowWidth / 2) - (100 / 2),
  }
  );

  const [btn1Container, setBtn1Container] = useState(
    {
      // flex: 1,
    position: 'absolute',
    width: 200,
    top: 2 * windowHeight / 5,
    left: (windowWidth / 2) - (200 / 2),
  }
  );

  const [btn2Container, setBtn2Container] = useState(
    {
    position: 'absolute',
    width: 200,
    top: 3 * windowHeight / 5,
    left: (windowWidth / 2) - (200 / 2),
  }
  );

  const [btnBackContainer, setBtnBackContainer] = useState(
    {
    position: 'absolute',
    width: 0,
    top: windowHeight - 50,
    left: 10,
  }
  );
const [creditsVisibility, setCreditsVisibility] = useState(false)
  const [trace2DVisibility, setTrace2DVisibility] = useState(false)
  const [trace3DVisibility, setTrace3DVisibility] = useState(false)

  const showAllButtons = () => {
    setBtn1Container({
      position: 'absolute',
    width: 200,
    top: 2 * windowHeight / 5,
    left: (windowWidth / 2) - (200 / 2),
  })

    setBtn2Container({
            position: 'absolute',
      width: 200,
    top: 3 * windowHeight / 5,
    left: (windowWidth / 2) - (200 / 2),
  })

    setCreditsBtnContainer({
      // flex: 1,
    position: 'absolute',
    width: 100,
    top: windowHeight - 50,
    left: (windowWidth / 2) - (100 / 2),
  })

    setTitleContainer({
      // flex: 1,
    position: 'absolute',
    width: 400,
    top: windowHeight / 10,
      height: 200,
    left: (windowWidth / 2) - (400 / 2),
      textAlign: 'center',
      backgroundColor: 'grey',
      justifyContent: 'center'
  })
  }

  const hideAllButtons = () => {
    setBtn1Container({
      position: 'absolute',
    width: '0%',
    height: '0%',
  })

    setBtn2Container({
      position: 'absolute',
    width: '0%',
    height: '0%',
  })

    setCreditsBtnContainer({
      position: 'absolute',
    width: '0%',
    height: '0%',
  })

    setTitleContainer({
      position: 'absolute',
    width: '0%',
    height: '0%',
  })
  }

  const creditsBtnClick = () => {
    console.log("credits btn clicked")
    setCreditsVisibility(true)
    hideAllButtons()
    setBtnBackContainer({
      position: 'absolute',
    width: 100,
    top: windowHeight - 50,
    left: 10,
    })
  }

  const trace2DBtnClick = () => {
    console.log("2D clicked")
    setTrace2DVisibility(true)
    hideAllButtons()
    setBtnBackContainer({
      position: 'absolute',
    width: 100,
    top: windowHeight - 50,
    left: 10,
    })
  }

    const trace3DBtnClick = () => {
    console.log("3D clicked")
    setTrace3DVisibility(true)
      hideAllButtons()
      setBtnBackContainer({
      position: 'absolute',
    width: 100,
    top: windowHeight - 50,
    left: 10,
    })
  }

  const backBtnClick = () => {
    console.log("back clicked")
    showAllButtons()
    setTrace2DVisibility(false)
    setTrace3DVisibility(false)
    setCreditsVisibility(false)
    setBtnBackContainer({
      position: 'absolute',
    width: 0,
    top: windowHeight - 50,
    left: 10,})
  }


  return (
  //   regarding the ordering of stuff within the html:
  // https://stackoverflow.com/questions/34139687/react-native-touchableopacity-wrapping-floating-button-get-nothing
    <View>

      <View style={titleContainer}>
      {/*  <Button*/}
      {/*  title="Schwarzchild Ray Tracing"*/}
      {/*  color="black"*/}
      {/*  // accessibilityLabel="Learn more about this purple button"*/}
      {/*/>*/}
        <Text style={titleTextContainer}>Schwarzschild Ray Tracing</Text>
      </View>

      <Credits visible={creditsVisibility} />
      <Trace2D visible={trace2DVisibility} />
      <Trace3D visible={trace3DVisibility}/>
      {/*<Plotly3DTest/>*/}

      <View style={btn1Container}>
        <Button
          onPress={trace2DBtnClick}
        title="2D Trace"
        color="green"
        // accessibilityLabel="Learn more about this purple button"
      />
      </View>

      <View style={btn2Container}>
        <Button
          onPress={trace3DBtnClick}
        title="3D Trace"
        color="green"
        // accessibilityLabel="Learn more about this purple button"
      />
      </View>

      <View style={creditsBtnContainer}>
        <Button
          onPress={creditsBtnClick}
        title="Credits"
        color="black"
        // accessibilityLabel="Learn more about this purple button"
      />
      </View>

      <View style={btnBackContainer}>
        <Button
          onPress={backBtnClick}
        title="Back"
        color="purple"
        // accessibilityLabel="Learn more about this purple button"
      />
      </View>


    </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
