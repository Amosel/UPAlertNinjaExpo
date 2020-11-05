import messaging from '@react-native-firebase/messaging';
import {Platform, NativeModules} from 'react-native';

import {types, Instance, flow, addDisposer} from 'mobx-state-tree';
const log = console.log;

const stateValues = {
  INITIALIZING: 'Initializing',
  IDLE: 'IDLE',
  REQUESTING_PERMISSION: 'RequestingPermission',
  GETTING_TOKEN: 'GettingToken',
  SUBSCRIBED: 'Subscribed',
};

const permissionStateValues = {
  GRANDTED: 'GRANDTED',
  REFUSED: 'Refused',
  FAILED: 'Failed',
  UNDETERMINED: 'Undetermined',
};

export const PushNotificationTokenModel = types
  .model('Token', {
    fcmToken: types.maybeNull(types.string),
    apnToken: types.maybeNull(types.string),
  })
  .volatile(() => ({
    state: stateValues.INITIALIZING,
    permission: permissionStateValues.UNDETERMINED,
    getTokenInTheFuture: false,
    requestPermissionInTheFuture: false,
  }))
  .views(self => ({
    get canGetToken() {
      return (
        self.state === stateValues.IDLE &&
        self.permission === permissionStateValues.GRANDTED
      );
    },
    get canRequestPermission() {
      return self.state === stateValues.IDLE;
    },
    get continueToRequestPermission() {
      return (
        self.permission === permissionStateValues.GRANDTED &&
        (self.requestPermissionInTheFuture || self.getTokenInTheFuture)
      );
    },
    get continueToGetToken() {
      return (
        self.permission === permissionStateValues.GRANDTED &&
        self.getTokenInTheFuture
      );
    },
  }))
  .actions(self => {
    let listener = () => {};
    let outerCallback = () => {};
    let logs: string[] = [];

    function flush(title: string) {
      log(title);
      logs.forEach(item => log(` ${item}`));
      logs = [];
    }

    function subscribe() {
      if (self.state === stateValues.SUBSCRIBED) {
        return;
      }
      logs.push('Subscribe to token updates');
      type Unsubscribe = () => void;
      let items: Unsubscribe[] = [];
      items.push(
        messaging().onTokenRefresh(token => {
          log(`Token updated to ${token}`);
          self.fcmToken = token;
        }),
      );
      logs.push('Setting up Notifications listener');
      items.push(
        messaging().onMessageSent(messageId => {
          log('Receied message id', messageId);
          if (outerCallback) {
            outerCallback();
          }
        }),
      );
      items.push(
        messaging().onMessage(message => {
          log('Receied message', message);
          if (outerCallback) {
            outerCallback();
          }
        }),
      );
      flush('Subscribed');
      listener = () => items.forEach(item => item());
    }

    const getToken = flow(function*() {
      if (self.canGetToken) {
        logs.push('Getting Token');
        self.state = stateValues.GETTING_TOKEN;
        try {
          const fcmToken = yield Platform.OS === 'ios'
            ? NativeModules.Workaround.getToken()
            : messaging().getToken();
          // const fcmToken = yield messaging().getToken();
          self.fcmToken = fcmToken;
          logs.push(`Got token:${self.fcmToken.substring(0, 10)}...`);
          if (Platform.OS === 'ios') {
            const apnToken = yield messaging().getAPNSToken();
            logs.push(apnToken ? `apn: ${apnToken}` : 'no apn token');
          }
        } catch (error) {
          self.fcmToken = null;
          logs.push('Failed gettings token', error);
        }
        subscribe();
      } else {
        logs.push('Setting to Get Token in the future');
        self.getTokenInTheFuture = true;
      }
      flush('Get token');
    });

    const requestPermission = flow(function*() {
      if (self.canRequestPermission) {
        logs.push('Requesting for Permission');
        self.state = 'RequestingPermission';
        try {
          const permission = yield messaging().requestPermission();
          self.permission = permission
            ? permissionStateValues.GRANDTED
            : permissionStateValues.REFUSED;
        } catch {
          self.permission = permissionStateValues.FAILED;
        }
        self.state = stateValues.IDLE;

        logs.push(`Permission is ${self.permission}`);

        if (self.continueToGetToken) {
          log('Continuing getting Token');
          self.getTokenInTheFuture = false;
          getToken();
        } else {
          flush('Request permission');
        }
      } else if (self.state === stateValues.INITIALIZING) {
        log('Initializing, will Request Permission when Idle');
        self.requestPermissionInTheFuture = true;
      }
    });
    const updatePermission = flow(function*() {
      logs.push('Checking for permission');
      try {
        const hasPermission = yield messaging().hasPermission();
        self.permission = hasPermission
          ? permissionStateValues.GRANDTED
          : permissionStateValues.REFUSED;
      } catch {}
      self.state = stateValues.IDLE;
      logs.push(`Permission is ${self.permission}`);

      if (self.continueToRequestPermission) {
        log('Continuing with requesting permission');
        self.requestPermissionInTheFuture = false;
        requestPermission();
      } else {
        flush('Update permission');
      }
    });

    return {
      afterCreate() {
        self.state = stateValues.INITIALIZING;
        self.permission = permissionStateValues.UNDETERMINED;
        updatePermission();
        addDisposer(self, () => {
          if (listener) {
            listener();
          }
        });
      },
      getToken,
      requestPermission,
      updatePermission,
      onMessage(callback: () => void) {
        outerCallback = callback;
      },
    };
  });

export type PushNotificationTokenModel = Instance<
  typeof PushNotificationTokenModel
>;
