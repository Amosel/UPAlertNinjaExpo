import Constants from 'expo-constants';
import {PlatformName, UserObject} from '../types';
import {Platform} from 'react-native';

function getPlatform(): PlatformName {
  return (
    Platform.select({
      ios: Constants.isDevice ? 'ios' : 'ios.simulator',
      android: Constants.isDevice ? 'android' : 'android.simulator',
    }) || 'unknown'
  );
}

export function firebaseUserObject(
  snapshot: Partial<UserObject>,
): Partial<UserObject> {
  const Url = require('url-parse');
  let userObject: Partial<UserObject> = {
    ...snapshot,
    plaform: getPlatform(),
  };
  if (snapshot.base_url) {
    const {host} = new Url(snapshot.base_url);
    userObject.host = host;
  }
  return userObject;
}
