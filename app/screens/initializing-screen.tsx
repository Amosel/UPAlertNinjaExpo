/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View} from 'react-native';
import {useCredentials} from '../provider';
import {useNavigation} from '@react-navigation/native';

export function InitializingScreen() {
  const credentials = useCredentials();
  const {navigate} = useNavigation();
  React.useEffect(() => {
    if (credentials) {
      navigate('App');
    } else {
      navigate('Settings');
    }
  }, [credentials]);

  return <View />;
}
