import {SnapshotIn, getSnapshot, addDisposer, flow} from 'mobx-state-tree';
import {reaction} from 'mobx';
import Constants from 'expo-constants';
import {CredentialsBase, RequestBase, UserObject, PlatformName} from '../types';
import {FirestoreUser} from './firestore.user.mst';
import {persistCredentials} from '../services/credentials.storage';
import {PushNotificationTokenModel} from './push-notifications.mst';
import {Platform} from 'react-native';

const log = console.log;

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

export const CredentialsModel = CredentialsBase.volatile(() => ({
  firestoreUser: FirestoreUser.create(),
  pushNotifications: PushNotificationTokenModel.create({}),
}))
  .actions((self) => {
    return {
      afterCreate() {
        // sending initial credentials value to firestore, it has a diff gate that will not update it if the snapshot coming from the servers is the same:
        const snapshot = getSnapshot(self);
        const userSnapshot = firebaseUserObject(snapshot);
        self.firestoreUser.update(userSnapshot);
        const update = flow(function* () {
          log('queuing firestore snapshot update and async store update');
          yield Promise.all([
            persistCredentials(snapshot),
            self.firestoreUser.update(firebaseUserObject(snapshot)),
          ]);
        });
        const onChange = reaction(() => getSnapshot(self), update);
        addDisposer(self, onChange);

        if (Platform.select({ios: Constants.isDevice, android: true})) {
          self.pushNotifications.getToken();
          addDisposer(
            self,
            reaction(
              () => self.pushNotifications.fcmToken,
              (fcmToken) => self.firestoreUser.update({fcmToken}),
            ),
          );
        } else {
          log('This is Simulator not dealing with Token here...');
        }
      },
    };
  })
  .views((self) => ({
    get requestBase(): RequestBase | null {
      if (self) {
        const {base_url, consumer_key, consumer_secret} = self;
        return {base_url, consumer_key, consumer_secret};
      }
    },
  }));
export type CredentialsStore = SnapshotIn<typeof CredentialsModel>;
