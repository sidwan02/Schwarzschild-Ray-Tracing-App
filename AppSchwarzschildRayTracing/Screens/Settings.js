import React from 'react'
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ScrollView,
  StatusBar, CheckBox,
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
    <View style={styles.container}>

   </View>
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
