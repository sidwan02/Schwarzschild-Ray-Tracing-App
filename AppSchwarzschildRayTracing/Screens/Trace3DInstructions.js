import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';

function Trace2DInstructions(props) {
  if (props.visible === false) {
    return <View></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.h1}>Instructions</Text>

      <Text style={styles.h2}>Manual Input</Text>

      <Text style={styles.h3}>Source Point Constraints</Text>
      <Text>
        We denote r_0 as the initial distance of the light source to the Black
        Hole. Please ensure that the ray starts outside the event horizon, i.e.,
        that r_0 >= 3
      </Text>
      <Text />
      <Text>
        r_0 can be calculated by the following equation: r_0 = sqrt(x^2 + y^2 +
        z^2).
      </Text>

      <Text style={styles.h3}>Angle Constraints</Text>
      <Text>Note that alpha_0, beta_0 and gamma_0 must be degree angles</Text>
      <Text />
      <Text>
        Make sure that the angle input values satisfy the following constraint
        in accordance with direction cosines: cos(l)^2 + cos(m)^2 + cos(n)^2 = 1
        where l, m and n correspond to the radian values of alpha_0, beta_0 and
        gamma_0 respectively.
      </Text>
      <Text />
      <Text>
        Note that you can also input just two of alpha_0, beta_0 and gamma_0.
        The third will be automatically populated if possible.
      </Text>
    </ScrollView>
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  italics: {
    fontStyle: 'italic',
  },
  titleContainer: {
    position: 'absolute',
    width: 350,
    top: windowHeight / 10,
    left: windowWidth / 2 - 350 / 2,
  },
  container: {
    top: StatusBar.currentHeight,
    height: windowHeight - 120,
    width: windowWidth - 40,
    position: 'absolute',
    margin: 20,
  },
  h1: {
    fontSize: 30,
    textDecorationLine: 'underline',
  },
  h2: {
    fontStyle: 'italic',
    fontSize: 25,
  },
  h3: {
    fontSize: 20,
  },
});

export default Trace2DInstructions;
