import firebase from 'firebase';
import {types, flow} from 'mobx-state-tree';
import {PartialUser} from '../types';
import {hasChanges} from '../model';

const log = console.log;

export const FirestoreUser = types
  .model('FirestoreUser', {
    state: types.optional(
      types.enumeration(['Initializing', 'Idle', 'Updating']),
      'Initializing',
    ),
  })
  .volatile(() => ({pendingUpdates: {}}))
  .actions((self) => {
    let current: firebase.firestore.DocumentSnapshot;
    const runIfNeededUpdate = flow(function* () {
      if (!current) {
        return;
      }
      const runUpdate =
        !current.exists || hasChanges(current.data(), self.pendingUpdates);
      if (runUpdate) {
        let logs: string[] = [];
        logs.push('Running update to firestore user');
        self.state = 'Updating';
        try {
          if (current.exists) {
            yield current.ref.update(self.pendingUpdates);
          } else {
            yield current.ref.set(self.pendingUpdates);
          }
        } catch (error) {
          console.warn('Failed updating user', error);
          logs.push('Failed updating Firestore user', error);
        } finally {
          log('Firestore User update');
          logs.forEach((item) => `  ${item}`);
          logs.push('Updated Firestore user');
          self.state = 'Idle';
        }
      }
    });

    return {
      runIfNeededUpdate,
      setCurrent(snapshot: firebase.firestore.DocumentSnapshot) {
        if (current && current.exists) {
          runIfNeededUpdate();
        }
        current = snapshot;
      },
    };
  })
  .actions((self) => {
    return {
      afterCreate: flow(function* () {
        const userCredential: firebase.auth.UserCredential = yield firebase
          .auth()
          .signInAnonymously();
        const ref = firebase
          .firestore()
          .doc(`users/${userCredential.user?.uid}`);
        ref.onSnapshot((snapshot) => {
          log('Received Firestore user Snapshot');
          self.setCurrent(snapshot);
          if (self.pendingUpdates !== {}) {
            self.runIfNeededUpdate();
            // updated pending changes...
          } else if (self.state === 'Initializing') {
            self.state = 'Idle';
          }
        });
      }),
      update(update: PartialUser) {
        self.pendingUpdates = {
          ...self.pendingUpdates,
          ...update,
        };
        self.runIfNeededUpdate();
      },
    };
  });
