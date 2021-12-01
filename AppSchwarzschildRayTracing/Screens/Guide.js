import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import CollapsibleView from '@eliav2/react-native-collapsible-view';

function Guide(props) {
  if (props.visible === false) {
    return <View></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <CollapsibleView title="2D Trace">
        <CollapsibleView title="Drag Input">
          <Text>
            Rest your finger on the screen. This point will be the source of
            your desired ray.
          </Text>
          <Text />
          <Text>
            Drag your finger to any other point on the screen. This will
            determine the initial angle of the trajectory with respect to the
            ray source.
          </Text>
        </CollapsibleView>

        <CollapsibleView title="Manual Input">
          <Text>
            Expand the Manual Entry Drop down. The cartesian plane is divided
            such that the black hole is situated at the origin.
          </Text>
          <Text />
          <Text>
            The width of the screen spans ± 8 Graviational Units (R_G), and the
            height of the screen spans ± 16 R_G.
          </Text>
          <Text />
          <Text>
            Note that delta_0 is defined to be anti-clockwise angle formed by
            the position vector of the ray source and the initial direction of
            the ray.{' '}
          </Text>

          <CollapsibleView title="Source Point Constraints">
            <Text>
              We denote r_0 as the initial distance of the light source to the
              Black Hole. Please ensure that the ray starts outside the event
              horizon, i.e., that r_0 >= 3
            </Text>
            <Text />
            <Text>
              r_0 can be calculated by the following equation: r_0 = sqrt(x^2 +
              y^2).
            </Text>
          </CollapsibleView>
        </CollapsibleView>

        <CollapsibleView title="Analysis Mode">
          <Text>
            Click on the Trace Analysis button, which will give a detailed plot
            of the ray and it's trajectory.
          </Text>
        </CollapsibleView>
      </CollapsibleView>

      <CollapsibleView title="3D Trace">
        <CollapsibleView title="Manual Input">
          <CollapsibleView title="Source Point Constraints">
            <Text>
              We denote r_0 as the initial distance of the light source to the
              Black Hole. Please ensure that the ray starts outside the event
              horizon, i.e., that r_0 >= 3
            </Text>
            <Text />
            <Text>
              r_0 can be calculated by the following equation: r_0 = sqrt(x^2 +
              y^2 + z^2).
            </Text>
          </CollapsibleView>

          <CollapsibleView title="Angle Constraints">
            <Text>
              Note that alpha_0, beta_0 and gamma_0 must be degree angles
            </Text>
            <Text />
            <Text>
              Make sure that the angle input values satisfy the following
              constraint in accordance with direction cosines: cos(l)^2 +
              cos(m)^2 + cos(n)^2 = 1 where l, m and n correspond to the radian
              values of alpha_0, beta_0 and gamma_0 respectively.
            </Text>
            <Text />
            <Text>
              Note that you can also input just two of alpha_0, beta_0 and
              gamma_0. The third will be automatically populated if possible.
            </Text>
          </CollapsibleView>
        </CollapsibleView>
      </CollapsibleView>
    </ScrollView>
  );
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
  },

  h2: {
    fontSize: 22,
  },
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
    top: StatusBar.currentHeight + 25,
    height: windowHeight - 120,
    width: windowWidth,
    position: 'absolute',
  },
});

export default Guide;
