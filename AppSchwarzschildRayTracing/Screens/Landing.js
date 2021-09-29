import React, {useState} from 'react'
import {Dimensions, View, Text, Button} from 'react-native';
import Trace2D from "./Trace2D";
import Trace3D from "./Trace3D";
import Credits from "./Credits";
import Guide from "./Guide";
import Trace3DInstructions from "./Trace3DInstructions";
import Trace2DInstructions from "./Trace2DInstructions";

function Landing() {
  const [titleContainer, setTitleContainer] = useState(
    {
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
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: (windowWidth / 2) - (100 / 2),
  }
  );

  const [guideBtnContainer, setGuideBtnContainer] = useState(
    {
      position: 'absolute',
      width: 100,
      top: windowHeight - 100,
      left: (windowWidth / 2) - (100 / 2),
  }
  );

    const [settingsBtnContainer, setSettingsBtnContainer] = useState(
    {
      position: 'absolute',
      width: 100,
      top: windowHeight - 150,
      left: (windowWidth / 2) - (100 / 2),
  }
  );

  const [btn1Container, setBtn1Container] = useState(
    {
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

  const [btnGo3DContainer, setBtnGo3DContainer] = useState(
    {
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10,
  }
  );


  const [btnGo2DContainer, setBtnGo2DContainer] = useState(
    {
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10,
  }
  );

  const [guideVisibility, setGuideVisibility] = useState(false)
  const [creditsVisibility, setCreditsVisibility] = useState(false)
  const [trace2DVisibility, setTrace2DVisibility] = useState(false)
  const [trace3DVisibility, setTrace3DVisibility] = useState(false)

  const [trace2DInstrucVisibility, setTrace2DInstrucVisibility] = useState(false)
  const [trace3DInstrucVisibility, setTrace3DInstrucVisibility] = useState(false)

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
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: (windowWidth / 2) - (100 / 2),
  })

    setGuideBtnContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 100,
      left: (windowWidth / 2) - (100 / 2),
  })

    setTitleContainer({
      position: 'absolute',
      width: 400,
      top: windowHeight / 10,
      height: 200,
      left: (windowWidth / 2) - (400 / 2),
      textAlign: 'center',
      backgroundColor: 'grey',
      justifyContent: 'center'
  })

    setSettingsBtnContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 150,
      left: (windowWidth / 2) - (100 / 2),
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

    setGuideBtnContainer({
      position: 'absolute',
      width: '0%',
      height: '0%',
  })

    setTitleContainer({
      position: 'absolute',
      width: '0%',
      height: '0%',
  })

    setSettingsBtnContainer({
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

  const guideBtnClick = () => {
    console.log("guide btn clicked")
    setGuideVisibility(true)
    hideAllButtons()
    setBtnBackContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    })
  }

  const settingsBtnClick = () => {
    console.log("settings btn clicked")
    setGuideVisibility(true)
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
    // setTrace2DVisibility(true)
    setTrace2DInstrucVisibility(true)
    hideAllButtons()
    setBtnBackContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    })

    setBtnGo2DContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      right: 10,
    })
  }

    const trace3DBtnClick = () => {
    console.log("3D clicked")
    // setTrace3DVisibility(true)
      setTrace3DInstrucVisibility(true)
      hideAllButtons()
      setBtnBackContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    })

      setBtnGo3DContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      right: 10,
    })
  }

  const backBtnClick = () => {
    console.log("back clicked")
    showAllButtons()
    setTrace2DVisibility(false)
    setTrace3DVisibility(false)
    setCreditsVisibility(false)
    setGuideVisibility(false)
    setTrace2DInstrucVisibility(false)
    setTrace3DInstrucVisibility(false)
    setBtnBackContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      left: 10
    })

    setBtnGo2DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10
    })

    setBtnGo3DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10
    })
  }

  const go2DBtnClick = () => {
    console.log("go 2D clicked")
    setTrace2DVisibility(true)
    setTrace2DInstrucVisibility(false)
    setBtnBackContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10
    })

    setBtnGo2DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10
    })
  }


  const go3DBtnClick = () => {
    console.log("go 3D clicked")
    setTrace3DVisibility(true)
    setTrace3DInstrucVisibility(false)
    setBtnBackContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10
    })

    setBtnGo3DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10
    })
  }

  return (
  //   regarding the ordering of stuff within the html:
  // https://stackoverflow.com/questions/34139687/react-native-touchableopacity-wrapping-floating-button-get-nothing
    <View>

      <View style={titleContainer}>
        <Text style={titleTextContainer}>Schwarzschild Ray Tracing</Text>
      </View>

      <Guide visible={guideVisibility} />
      <Credits visible={creditsVisibility} />
      <Trace2D visible={trace2DVisibility} />
      <Trace3D visible={trace3DVisibility}/>
      <Trace2DInstructions visible={trace2DInstrucVisibility}/>
      <Trace3DInstructions visible={trace3DInstrucVisibility}/>

      <View style={btn1Container}>
        <Button
          onPress={trace2DBtnClick}
        title="2D Trace"
        color="green"
      />
      </View>

      <View style={btn2Container}>
        <Button
          onPress={trace3DBtnClick}
        title="3D Trace"
        color="green"
      />
      </View>

      <View style={settingsBtnContainer}>
        <Button
          onPress={settingsBtnClick}
        title="Settings"
        color="black"
      />
      </View>

      <View style={guideBtnContainer}>
        <Button
          onPress={guideBtnClick}
        title="Guide"
        color="black"
      />
      </View>

      <View style={creditsBtnContainer}>
        <Button
          onPress={creditsBtnClick}
        title="Credits"
        color="black"
      />
      </View>

      <View style={btnBackContainer}>
        <Button
          onPress={backBtnClick}
        title="Back"
        color="purple"
      />
      </View>

      <View style={btnGo2DContainer}>
        <Button
          onPress={go2DBtnClick}
        title="Go"
        color="orange"
      />
      </View>

      <View style={btnGo3DContainer}>
        <Button
          onPress={go3DBtnClick}
        title="Go"
        color="orange"
      />
      </View>


    </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Landing;
