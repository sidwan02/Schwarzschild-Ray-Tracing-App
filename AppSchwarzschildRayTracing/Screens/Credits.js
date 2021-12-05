import React from 'react';
import { StyleSheet, Dimensions, View, Text, Linking } from 'react-native';

function Credits(props) {
  if (props.visible === false) {
    return <View></View>;
  }

  return (
    //   regarding the ordering of stuff within the html:
    // https://stackoverflow.com/questions/34139687/react-native-touchableopacity-wrapping-floating-button-get-nothing
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.h1}>Authors:</Text>
        <Text style={styles.h2}>Siddharth Diwan</Text>
        <Text style={styles.h3}>Brown University</Text>
        <Text style={styles.h4}>Sc.B. Computer Science, B.A. Astronomy</Text>
        <View style={styles.inline}>
          <Text
            style={styles.child}
            onPress={() =>
              Linking.openURL('https://www.linkedin.com/in/siddharth-diwan/')
            }
          >
            LinkedIn
          </Text>
          <Text
            style={styles.child}
            onPress={() => Linking.openURL('https://www.github.com/sidwan02/')}
          >
            GitHub
          </Text>
          <Text
            style={styles.child}
            onPress={() => Linking.openURL('mailto:siddharth_diwan@brown.edu')}
          >
            Email
          </Text>
        </View>

        <Text />

        <Text style={styles.h2}>Dipankar Maitra</Text>
        <Text style={styles.h3}>Wheaton College Massachusetts</Text>
        <Text style={styles.h4}>Associate Professor of Physics/Astronomy </Text>
      </View>
    </View>
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
  inline: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
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
  h4: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  child: {
    marginRight: windowWidth / 5,
    textDecorationLine: 'underline',
  },
});

export default Credits;
