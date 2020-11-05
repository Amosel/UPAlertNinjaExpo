import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from 'react-navigation-hooks';
import styles from '../styles';

export function DismissButton() {
  const {dismiss} = useNavigation();

  return (
    <TouchableOpacity onPress={() => dismiss()}>
      <Text style={styles.dismissText}>Cancel</Text>
    </TouchableOpacity>
  );
}
