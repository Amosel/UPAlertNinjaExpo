import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles';

export function DismissButton() {
  const {goBack} = useNavigation();

  return (
    <TouchableOpacity onPress={() => goBack()}>
      <Text style={styles.dismissText}>Cancel</Text>
    </TouchableOpacity>
  );
}
