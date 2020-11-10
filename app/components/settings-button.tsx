/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

export function SettingsButton() {
  const {navigate} = useNavigation();
  return (
    <TouchableOpacity
      style={{paddingRight: 18}}
      onPress={() => navigate('Settings')}>
      <Image source={require('../assets/settings.png')} />
    </TouchableOpacity>
  );
}
