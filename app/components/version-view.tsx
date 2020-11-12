import React from 'react';
import {Text} from 'react-native';
import styles, {colors} from '../styles';
import {useStore} from '../provider';
import {EnvType} from '../store/env.mst';

export function VersionView() {
  const store = useStore();
  const {env} = store!;

  if (__DEV__) {
    return (
      <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
        Debug Version
      </Text>
    );
  } else if (!env.expo.version) {
    return (
      <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
        Unknown Expo Version
      </Text>
    );
  }
  return (
    <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
      {`Expo Version: ${env.expo.version}`}
    </Text>
  );
}
