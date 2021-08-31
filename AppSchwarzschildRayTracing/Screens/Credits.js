import React from 'react'
import {StyleSheet, Dimensions, View, Text} from 'react-native';

function Credits(props) {

  if (props.visible === false) {
    return (
    <View>
    </View>
  );
  }

  return (
  //   regarding the ordering of stuff within the html:
  // https://stackoverflow.com/questions/34139687/react-native-touchableopacity-wrapping-floating-button-get-nothing
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.bold}>Authors:</Text>
          <Text>Siddharth Diwan</Text>
        <Text>Sc.B. Computer Science, B.A. Astronomy</Text>
        <Text style={styles.italics}>Brown University</Text>
        <Text>&lt;siddharth_diwan@brown.edu&gt;</Text>
        <Text/>
        <Text>Dipankar Maitra</Text>
        <Text>Associate Professor of Physics/Astronomy </Text>
        <Text style={styles.italics}>Wheaton College Massachusetts</Text>
      </View>
    </View>
  )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
  }
});

export default Credits;
