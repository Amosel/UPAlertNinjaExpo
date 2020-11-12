import {
  Instance,
  types,
  flow,
  getSnapshot,
  SnapshotIn,
  addDisposer,
} from 'mobx-state-tree';
import {isEqual} from 'lodash';
import {AppState, AppStateStatus} from 'react-native';
import {Credentials} from '../types';
import {wipeStorage, persistStorage} from '../services/general.storage';
import {
  persistCredentials,
  restoreCredentials,
} from '../services/credentials.storage';
import {CredentialsModel} from './credentials.mst';
import {
  OrdersStore,
  restoreOrderStore,
  initialSnapsot,
  hasDataToPersist,
} from './order-store';
import {getEnv, EnvModel} from './env.mst';
import {reaction} from 'mobx';

const log = console.log;
// const log = (_message?: any, ..._optionalParams: any[]) => {};

export const App = types
  .model('OrdersStore', {
    credentials: types.maybeNull(CredentialsModel),
    orders: types.maybeNull(OrdersStore),
    env: EnvModel,
  })
  .actions((self) => {
    let appState: AppStateStatus = AppState.currentState;
    function handleOrdersChange() {
      if (self.orders) {
        addDisposer(
          self,
          reaction(
            () => hasDataToPersist(self.orders || {}),
            () => {
              if (self.credentials != null) {
                log('Persisting Order Store');
                persistStorage(
                  self.credentials,
                  JSON.stringify(getSnapshot(self.orders!)),
                );
              }
            },
          ),
        );
      }
    }
    function handleCredentialsChange() {
      if (self.credentials) {
        if (!self.orders) {
          const {base_url, consumer_key, consumer_secret} = self.credentials;
          const requestBase = {base_url, consumer_key, consumer_secret};
          const snapshot = {
            ...initialSnapsot,
            requestBase,
            ...self.env,
          };
          self.orders = OrdersStore.create(snapshot);
        }
        self.credentials.pushNotifications.onMessage(() => {
          if (self.orders) {
            self.orders.fetchOrders(true);
          }
        });
        self.orders.fetchOrders();
        persistCredentials(self.credentials);
      }
    }
    function handleAppStateChange(state: AppStateStatus) {
      if (state === 'active' && appState !== 'active' && self.orders) {
        log('Reloading orders after app became active again');
        self.orders.fetchOrders(true);
      }
      appState = state;
    }
    return {
      afterCreate() {
        handleCredentialsChange();
        handleOrdersChange();
        AppState.addEventListener('change', handleAppStateChange);
        addDisposer(
          self,
          reaction(() => self.credentials, handleCredentialsChange),
        );
        addDisposer(
          self,
          reaction(() => self.orders, handleOrdersChange),
        );
      },
      beforeDestroy() {
        AppState.removeEventListener('change', handleAppStateChange);
      },
      setCredentials: flow(function* (input: Credentials) {
        if (
          self.credentials === null ||
          !isEqual(getSnapshot(self.credentials), input)
        ) {
          const previousCredentials = self.credentials;
          try {
            self.credentials = CredentialsModel.create(input);
            if (previousCredentials) {
              wipeStorage(previousCredentials);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }),
    };
  });

type AppSnapshot = SnapshotIn<typeof App>;

export async function restoreApp() {
  log('Restoring app');
  const [credentials, env] = await Promise.all([
    restoreCredentials(),
    getEnv(),
  ]);
  let snapshot: AppSnapshot = {
    credentials,
    orders: null,
    env,
  };
  if (credentials !== null) {
    const {base_url, consumer_key, consumer_secret} = credentials;
    const requestBase = {base_url, consumer_key, consumer_secret};
    const restoredOrdersStore = await restoreOrderStore(credentials);
    snapshot.orders = {
      ...initialSnapsot,
      ...restoredOrdersStore,
      requestBase,
      ...env,
    };
  }
  return App.create(snapshot);
}

export type IApp = Instance<typeof App>;
