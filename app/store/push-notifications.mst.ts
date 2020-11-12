import firebase from 'firebase';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';

const messaging = firebase.messaging;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  [Notifications.DevicePushToken, Notifications.ExpoPushToken] | false
> {
  if (Constants.isDevice) {
    log('Getting Permission for Notification');
    let response = await Notifications.getPermissionsAsync();

    if (response.granted === false && response.canAskAgain === true) {
      response = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      if (!response.granted) {
        // eslint-disable-next-line no-alert
        alert('Failed to get push token for push notification!');
        return false;
      }
      return await Promise.all([
        Notifications.getDevicePushTokenAsync(),
        Notifications.getExpoPushTokenAsync(),
      ]);
    } else {
      return false;
    }
  } else {
    log('Not Getting Token, we are in simulator');
    return false;
  }
}

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

export const NativeTokenModel = types.model('token', {
  type: types.union(types.literal('ios'), types.literal('android')),
  data: types.union(
    types.string,
    types.model({
      endpoint: types.string,
      keys: types.model({
        p256dh: types.string,
        auth: types.string,
      }),
    }),
  ),
});

export const ExpoPushTokenModel = types.model('expo-token', {
  type: types.literal('expo'),
  data: types.string,
});

export const PushNotificationTokenModel = types
  .model('Token', {
    expoToken: types.maybeNull(ExpoPushTokenModel),
    apnToken: types.maybeNull(NativeTokenModel),
  })
  .volatile(() => ({
    state: stateValues.INITIALIZING,
    permission: permissionStateValues.UNDETERMINED,
    getTokenInTheFuture: false,
    requestPermissionInTheFuture: false,
  }))
  .actions((self) => {
    let listener = () => {};
    let outerCallback = () => {};
    let logs: string[] = [];

    function flush(title: string) {
      log(title);
      logs.forEach((item) => log(` ${item}`));
      logs = [];
    }

    function subscribe() {
      if (self.state === stateValues.SUBSCRIBED) {
        return;
      }
      logs.push('Subscribe to token updates');
      messaging()
        .getToken()
        .then((token) => {
          self.expoToken = {type: 'expo', data: token};
        });

      type Unsubscribe = () => void;
      let items: Unsubscribe[] = [];
      // items.push(
      //   messaging().onTokenRefresh((token) => {
      //     log(`Token updated to ${token}`);
      //     self.fcmToken = token;
      //   }),
      // );
      logs.push('Setting up Notifications listener');
      // items.push(
      // messaging().onMessage((messageId) => {
      // messaging().onMessageSent((messageId) => {
      //   log('Receied message id', messageId);
      //   if (outerCallback) {
      //     outerCallback();
      //   }
      // }),
      // );
      items.push(
        messaging().onMessage((message) => {
          log('Receied message', message);
          if (outerCallback) {
            outerCallback();
          }
        }),
      );
      items.push(
        messaging().onBackgroundMessage((message) => {
          log('Receied message in background', message);
          if (outerCallback) {
            outerCallback();
          }
        }),
      );
      flush('Subscribed');
      listener = () => items.forEach((item) => item());
    }

    const getToken = flow(function* () {
      self.state = stateValues.GETTING_TOKEN;
      const result:
        | [Notifications.DevicePushToken, Notifications.ExpoPushToken]
        | false = yield registerForPushNotificationsAsync();
      if (result !== false) {
        try {
          const [apnToken, expoToken] = result;
          // const fcmToken = yield messaging().getToken();
          self.expoToken = expoToken;
          logs.push(`Got token:${expoToken.data.substring(0, 10)}...`);
          if (Platform.OS === 'ios') {
            logs.push(apnToken ? `apn: ${apnToken}` : 'no apn token');
          }
        } catch (error) {
          self.expoToken = null;
          logs.push('Failed gettings token', error);
        }
        subscribe();
      } else {
        logs.push('Setting to Get Token in the future');
        self.getTokenInTheFuture = true;
      }
      flush('Get token');
    });

    return {
      afterCreate() {
        self.state = stateValues.INITIALIZING;
        self.permission = permissionStateValues.UNDETERMINED;
        getToken();
        addDisposer(self, () => {
          if (listener) {
            listener();
          }
        });
      },
      getToken,
      onMessage(callback: () => void) {
        outerCallback = callback;
      },
    };
  });

export type PushNotificationTokenModel = Instance<
  typeof PushNotificationTokenModel
>;
