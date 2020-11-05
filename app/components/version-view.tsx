import React from 'react';
import {Text} from 'react-native';
import styles, {colors} from '../styles';
import {useStore} from '../provider';

export function VersionView() {
  const store = useStore();
  const {env} = store;

  if (__DEV__) {
    return (
      <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
        Debug Version
      </Text>
    );
  } else if (!env.codepush) {
    return (
      <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
        Unknown Code Push Version
      </Text>
    );
  }
  return (
    <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
      {`Code Push Version: ${env.codepush.appVersion}`}
    </Text>
  );
}
