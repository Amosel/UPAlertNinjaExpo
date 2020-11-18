import React from 'react';
import {Text} from 'react-native';
import styles, {colors} from '../styles';
import {useStore} from '../provider';
import Constant from 'expo-constants';
import {DEV, PRODUCTION, STAGING} from '../constants';

export function VersionView() {
  const store = useStore();
  const {env} = store!;
  const ownership = Constant.appOwnership || 'unknown';
  const expoVersion = `${ownership}: ${Constant.expoVersion}`;
  const systemVersion = Constant.systemVersion || 'unknown';
  const {releaseId, revisionId, releaseChannel} = Constant.manifest;
  const release = Constant.manifest.releaseId
    ? `\nRevision: ${revisionId} \nRelease: ${releaseId?.substr(
        releaseId.length - 10,
        10,
      )} \nChannel: ${releaseChannel} ${Constant.manifest.publishedTime && ''}`
    : '';
  let text = 'unknown';
  switch (env.environment) {
    case PRODUCTION: {
      text = `Version: ${expoVersion} \n ${release ? release : ''} `;
      break;
    }
    case STAGING: {
      text = `${expoVersion} ${
        systemVersion !== 'unknown' ? `n\nsystem version: ${systemVersion}` : ''
      } ${release ? `\n${release}` : ''}\n`;
      break;
    }
    case DEV: {
      text = `${expoVersion} ${
        systemVersion !== 'unknown' ? `n\nsystem version: ${systemVersion}` : ''
      } ${release ? `\n${release}` : ''}\n`;
      break;
    }
  }
  return (
    <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>{text}</Text>
  );
}
