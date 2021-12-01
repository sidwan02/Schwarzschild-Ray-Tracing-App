import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import Landing from './Screens/Landing';

export default function App() {
  return (
    <View>
      <Landing />
      <StatusBar style="auto" />
    </View>
  );
}
