import React from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import CollapsibleView from "@eliav2/react-native-collapsible-view";

function Guide(props) {

  if (props.visible === false) {
    return (
    <View>
    </View>
  );
  }

  return (
    <ScrollView style={styles.container}>
      <CollapsibleView title="2D Trace">

        <CollapsibleView title="Drag Input">
          <Text>Rest your finger on the screen. This point will be the source of your desired ray.</Text>
          <Text/>
          <Text>Drag your finger to any other point on the screen. This will determine the initial angle of the trajectory with respect to the ray source.</Text>
        </CollapsibleView>

        <CollapsibleView title="Manual Input">
          <Text>Expand the Manual Entry Drop down. The cartesian plan is divided such that the black hole is situated at the origin.</Text>
          <Text/>
          <Text>The width of the screen spans +/- 20, and the height of the screen spans +/- 40.</Text>
          <Text/>
          <Text>Note that delta0 is defined to be anti-clockwise angle formed by the position vector of the ray source and the initial direction of the ray. </Text>
        </CollapsibleView>

        <CollapsibleView title="Analysis Mode">
          <Text>Click on the Trace Analysis button, which will give a detailed plot of the ray and it's trajectory.</Text>
        </CollapsibleView>

      </CollapsibleView>

      <CollapsibleView title="3D Trace">

        <CollapsibleView title="Manual Input">
          <Text>Note that alpha0, beta0 and gamma0 must be degree angles</Text>
          <Text/>
          <Text>Make sure that input values satisfy the following constraint in accordance with direction cosines: cos(l)^2 + cos(m)^2 + cos(n)^2 = 1 where l, m and n correspond to the converted forms of alpha0, beta0 and gamma0 into radians.</Text>
          <Text/>
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
      fontWeight: 'bold'
  },
  italics: {
      fontStyle: 'italic'
  },
  titleContainer: {
    position: 'absolute',
    width: 350,
    top: windowHeight / 10,
    left: (windowWidth / 2) - (350 / 2)
  },
  container: {
    top: StatusBar.currentHeight + 25,
    height: windowHeight - 120,
    width: windowWidth,
    position: 'absolute',
  },
});

export default Guide;
