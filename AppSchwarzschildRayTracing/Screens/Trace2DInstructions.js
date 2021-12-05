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

      <Text style={styles.h2}>Drag Input</Text>
      <Text>
        Rest your finger on the screen. This point will be the source of your
        desired ray.
      </Text>
      <Text />
      <Text>
        Drag your finger to any other point on the screen. This will determine
        the initial angle of the trajectory with respect to the ray source.
      </Text>

      <Text style={styles.h2}>Manual Input</Text>
      <Text>
        Expand the Manual Entry Drop down. The cartesian plane is divided such
        that the black hole is situated at the origin.
      </Text>
      <Text />
      <Text>
        The width of the screen spans ± 8 Gravitational Units (R_G), and the
        height of the screen spans ± 16 G_R.
      </Text>
      <Text />
      <Text>
        Note that delta_0 is defined to be anti-clockwise angle formed by the
        position vector of the ray source and the initial direction of the ray.{' '}
      </Text>

      <Text style={styles.h3}>Source Point Constraints</Text>
      <Text>
        We denote r_0 as the initial distance of the light source to the Black
        Hole. Please ensure that the ray starts outside the event horizon, i.e.,
        that r_0 >= 3
      </Text>
      <Text />
      <Text>
        r_0 can be calculated by the following equation: r_0 = sqrt(x^2 + y^2).
      </Text>

      <Text style={styles.h2}>Analysis Mode</Text>
      <Text>
        Click on the Trace Analysis button, which will give a detailed plot of
        the ray and it's trajectory.
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
    height: windowHeight - 110,
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
