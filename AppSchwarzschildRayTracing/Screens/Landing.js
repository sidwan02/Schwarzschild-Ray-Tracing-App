import React, { useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  Button,
  CheckBox,
  Linking,
  StyleSheet,
} from 'react-native';
import Trace2D from './Trace2D';
import Trace3D from './Trace3D';
import Credits from './Credits';
import Guide from './Guide';
// import Feedback from './Feedback';
import Trace3DInstructions from './Trace3DInstructions';
import Trace2DInstructions from './Trace2DInstructions';

function Landing() {
  const [instructions2DHidden, setInstructions2DHidden] = useState(false);
  const [instructions3DHidden, setInstructions3DHidden] = useState(false);

  const [titleContainer, setTitleContainer] = useState({
    position: 'absolute',
    width: 400,
    top: windowHeight / 10,
    height: 200,
    left: windowWidth / 2 - 400 / 2,
    textAlign: 'center',
    backgroundColor: 'grey',
    justifyContent: 'center',
  });

  const titleTextContainer = useState({
    textAlign: 'center',
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 50,
    textShadowColor: 'white',
    textShadowRadius: 10,
    fontWeight: 'bold',
  });

  const [creditsBtnContainer, setCreditsBtnContainer] = useState({
    position: 'absolute',
    width: 100,
    top: windowHeight - 185,
    left: windowWidth / 2 - 100 / 2,
  });

  const [guideBtnContainer, setGuideBtnContainer] = useState({
    position: 'absolute',
    width: 100,
    top: windowHeight - 250,
    left: windowWidth / 2 - 100 / 2,
  });

  const [checkbox2DContainer, setCheckbox2DContainer] = useState({
    top: windowHeight - 120,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  });

  const [checkbox3DContainer, setCheckbox3DContainer] = useState({
    top: windowHeight - 120,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  });

  const [feedbackDiv, setFeedbackDiv] = useState({
    top: windowHeight - 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  });

  const [btn1Container, setBtn1Container] = useState({
    position: 'absolute',
    width: 200,
    top: (2.2 * windowHeight) / 5,
    left: windowWidth / 2 - 200 / 2,
  });

  const [btn2Container, setBtn2Container] = useState({
    position: 'absolute',
    width: 200,
    top: (2.8 * windowHeight) / 5,
    left: windowWidth / 2 - 200 / 2,
  });

  const [btnHomeContainer, setBtnHomeContainer] = useState({
    position: 'absolute',
    width: 0,
    top: windowHeight - 50,
    left: 10,
  });

  const [btnGo3DContainer, setBtnGo3DContainer] = useState({
    position: 'absolute',
    width: 0,
    top: windowHeight - 50,
    right: 10,
  });

  const [btnGo2DContainer, setBtnGo2DContainer] = useState({
    position: 'absolute',
    width: 0,
    top: windowHeight - 50,
    right: 10,
  });

  const [guideVisibility, setGuideVisibility] = useState(false);
  const [creditsVisibility, setCreditsVisibility] = useState(false);
  const [trace2DVisibility, setTrace2DVisibility] = useState(false);
  const [trace3DVisibility, setTrace3DVisibility] = useState(false);

  const [trace2DInstrucVisibility, setTrace2DInstrucVisibility] =
    useState(false);
  const [trace3DInstrucVisibility, setTrace3DInstrucVisibility] =
    useState(false);

  const showAllButtons = () => {
    setBtn1Container({
      position: 'absolute',
      width: 200,
      top: (2.2 * windowHeight) / 5,
      left: windowWidth / 2 - 200 / 2,
    });

    setBtn2Container({
      position: 'absolute',
      width: 200,
      top: (2.8 * windowHeight) / 5,
      left: windowWidth / 2 - 200 / 2,
    });

    setCreditsBtnContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 185,
      left: windowWidth / 2 - 100 / 2,
    });

    setGuideBtnContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 250,
      left: windowWidth / 2 - 100 / 2,
    });

    setTitleContainer({
      position: 'absolute',
      width: 400,
      top: windowHeight / 10,
      height: 200,
      left: windowWidth / 2 - 400 / 2,
      textAlign: 'center',
      backgroundColor: 'grey',
      justifyContent: 'center',
    });

    setFeedbackDiv({
      top: windowHeight - 100,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    });

    setCheckbox2DContainer({
      top: windowHeight - 120,
      alignItems: 'center',
      justifyContent: 'center',

      flexDirection: 'row',
    });

    setCheckbox3DContainer({
      alignItems: 'center',
      justifyContent: 'center',
      top: windowHeight - 120,

      flexDirection: 'row',
    });
  };

  const hideAllButtons = () => {
    setBtn1Container({
      position: 'absolute',
      width: '0%',
      height: '0%',
    });

    setBtn2Container({
      position: 'absolute',
      width: '0%',
      height: '0%',
    });

    setCreditsBtnContainer({
      position: 'absolute',
      width: '0%',
      height: '0%',
    });

    setGuideBtnContainer({
      position: 'absolute',
      width: '0%',
      height: '0%',
    });

    setTitleContainer({
      position: 'absolute',
      width: '0%',
      height: '0%',
    });

    setFeedbackDiv({
      position: 'absolute',
      width: '0%',
      height: '0%',
    });

    setCheckbox2DContainer({
      position: 'absolute',
      width: '0%',
      height: '0%',
      top: -100,
    });

    setCheckbox3DContainer({
      position: 'absolute',
      width: '0%',
      height: '0%',
      top: -100,
    });
  };

  const creditsBtnClick = () => {
    console.log('credits btn clicked');
    setCreditsVisibility(true);
    hideAllButtons();
    setBtnHomeContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    });
  };

  const guideBtnClick = () => {
    console.log('guide btn clicked');
    setGuideVisibility(true);
    hideAllButtons();
    setBtnHomeContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    });
  };

  const settingsBtnClick = () => {
    console.log('settings btn clicked');
    setGuideVisibility(true);
    hideAllButtons();
    setBtnHomeContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    });
  };

  const trace2DBtnClick = () => {
    console.log('2D clicked');

    if (instructions2DHidden) {
      // setTrace2DVisibility(true)
      setTrace2DVisibility(true);
      hideAllButtons();
      setBtnHomeContainer({
        position: 'absolute',
        width: 100,
        top: windowHeight - 50,
        left: 10,
      });
    } else {
      // setTrace2DVisibility(true)
      setTrace2DInstrucVisibility(true);
      hideAllButtons();
      setBtnHomeContainer({
        position: 'absolute',
        width: 100,
        top: windowHeight - 50,
        left: 10,
      });

      setBtnGo2DContainer({
        position: 'absolute',
        width: 100,
        top: windowHeight - 50,
        right: 10,
      });
    }
  };

  const trace3DBtnClick = () => {
    console.log('3D clicked');

    if (instructions3DHidden) {
      setTrace3DVisibility(true);
      hideAllButtons();
      setBtnHomeContainer({
        position: 'absolute',
        width: 100,
        top: windowHeight - 50,
        left: 10,
      });
    } else {
      setTrace3DInstrucVisibility(true);
      hideAllButtons();
      setBtnHomeContainer({
        position: 'absolute',
        width: 100,
        top: windowHeight - 50,
        left: 10,
      });

      setBtnGo3DContainer({
        position: 'absolute',
        width: 100,
        top: windowHeight - 50,
        right: 10,
      });
    }
  };

  const backBtnClick = () => {
    console.log('back clicked');
    showAllButtons();
    setTrace2DVisibility(false);
    setTrace3DVisibility(false);
    setCreditsVisibility(false);
    setGuideVisibility(false);
    setTrace2DInstrucVisibility(false);
    setTrace3DInstrucVisibility(false);
    setBtnHomeContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      left: 10,
    });

    setBtnGo2DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10,
    });

    setBtnGo3DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10,
    });
  };

  const go2DBtnClick = () => {
    console.log('go 2D clicked');
    setTrace2DVisibility(true);
    setTrace2DInstrucVisibility(false);
    setBtnHomeContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    });

    setBtnGo2DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10,
    });
  };

  const go3DBtnClick = () => {
    console.log('go 3D clicked');
    setTrace3DVisibility(true);
    setTrace3DInstrucVisibility(false);
    setBtnHomeContainer({
      position: 'absolute',
      width: 100,
      top: windowHeight - 50,
      left: 10,
    });

    setBtnGo3DContainer({
      position: 'absolute',
      width: 0,
      top: windowHeight - 50,
      right: 10,
    });
  };

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
      <Trace3D visible={trace3DVisibility} />
      <Trace2DInstructions visible={trace2DInstrucVisibility} />
      <Trace3DInstructions visible={trace3DInstrucVisibility} />

      <View style={btn1Container}>
        <Button
          style={styles.traceBtn}
          onPress={trace2DBtnClick}
          title="2D Trace"
          color="green"
        />
      </View>

      <View style={btn2Container}>
        <Button onPress={trace3DBtnClick} title="3D Trace" color="green" />
      </View>

      {/*<View style={settingsBtnContainer}>*/}
      {/*  <Button*/}
      {/*    onPress={settingsBtnClick}*/}
      {/*  title="Settings"*/}
      {/*  color="black"*/}
      {/*/>*/}
      {/*</View>*/}

      <View style={guideBtnContainer}>
        <Button onPress={guideBtnClick} title="Guide" color="black" />
      </View>

      <View style={creditsBtnContainer}>
        <Button onPress={creditsBtnClick} title="Credits" color="black" />
      </View>

      <View style={btnHomeContainer}>
        <Button onPress={backBtnClick} title="Home" color="purple" />
      </View>

      <View style={btnGo2DContainer}>
        <Button onPress={go2DBtnClick} title="Go" color="orange" />
      </View>

      <View style={btnGo3DContainer}>
        <Button onPress={go3DBtnClick} title="Go" color="orange" />
      </View>

      <View style={checkbox2DContainer}>
        <CheckBox
          value={instructions2DHidden}
          onValueChange={setInstructions2DHidden}
        />
        <Text>Skip 2D Trace Instructions</Text>
      </View>

      <View style={checkbox3DContainer}>
        <CheckBox
          value={instructions3DHidden}
          onValueChange={setInstructions3DHidden}
        />
        <Text>Skip 3D Trace Instructions</Text>
      </View>

      <View style={feedbackDiv}>
        <Text
          style={styles.underline}
          onPress={() =>
            Linking.openURL(
              'https://docs.google.com/forms/d/e/1FAIpQLSc1SUJKyMbDaHpTk3gGEiFAZ5sL2G_-4e5VlNKJi6AfwohCHg/viewform?usp=sf_link'
            )
          }
        >
          Give Feedback!
        </Text>
      </View>
    </View>
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Landing;

const styles = StyleSheet.create({
  underline: {
    textDecorationLine: 'underline',
  },
});
