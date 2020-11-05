import Constants from 'expo-constants';
import {PlatformName, UserObject} from '../types';

function getPlatform(): PlatformName {
  if (Constants.platform.ios) {
    if (Constants.isDevice) {
      return 'ios';
    } else {
      return 'ios.simulator';
    }
  } else if (Constants.platform.android) {
    if (Constants.isDevice) {
      return 'android';
    } else {
      return 'android.simulator';
    }
  } else {
    return 'unknown';
  }
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
