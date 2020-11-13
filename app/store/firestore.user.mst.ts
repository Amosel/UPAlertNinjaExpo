import firebase from 'firebase';
import {types, flow} from 'mobx-state-tree';
import {PartialUser} from '../types';
import {hasChanges} from '../model';

const log = console.log;

const firebaseConfig = {
  apiKey: 'AIzaSyA9_m5hnq4x2Pz2HUiiSrUEmio4bui6yUU',
  authDomain: 'restaurantninja-c36c4.firebaseapp.com',
  databaseURL: 'https://restaurantninja-c36c4.firebaseio.com',
  projectId: 'restaurantninja-c36c4',
  storageBucket: 'restaurantninja-c36c4.appspot.com',
  messagingSenderId: '162845958826',
  appId: '1:162845958826:web:c812664b8771fbdc7be6d3',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const IDLE_STSTE = 'idle';
const INITIALIZING_STATE = 'Initializing';
const UPDATING_STATE = 'Updating';

export const FirestoreUser = types
  .model('FirestoreUser', {
    state: types.optional(
      types.enumeration([INITIALIZING_STATE, IDLE_STSTE, UPDATING_STATE]),
      INITIALIZING_STATE,
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
        self.state = UPDATING_STATE;
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
          self.state = IDLE_STSTE;
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
        const uid = userCredential.user!.uid;
        log(`anonymous firebase loging with uid: ${uid}`);
        const ref = firebase.firestore().doc(`users/${uid}`);
        ref.onSnapshot((snapshot) => {
          log('Received Firestore user Snapshot');
          self.setCurrent(snapshot);
          if (self.pendingUpdates !== {}) {
            self.runIfNeededUpdate();
            // updated pending changes...
          } else if (self.state === INITIALIZING_STATE) {
            self.state = IDLE_STSTE;
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
