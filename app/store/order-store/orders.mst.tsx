import {
  types,
  flow,
  Instance,
  SnapshotIn,
  addDisposer,
  SnapshotOut,
} from 'mobx-state-tree';
import {reaction} from 'mobx';
import {pick} from 'lodash';
import {playSound, pauseSound} from '../../services/audio';
import {
  Order,
  Filter,
  OrderIds,
  LoadingState,
  loadingStateValues,
  ClosedOrdersView,
  OpenOrdersView,
  OrderStatus,
  ClosedItemsSection,
  errorTypes,
  ErrorModel,
  ErrorType,
  NotificationsArray,
  OrdersArray,
  filterValues,
  APIRequestBase,
  OrderSnap,
} from '../../types';
import {
  isOpen,
  getId,
  timeFromNow,
  isWithinTheLast24Hours,
  isCompleted,
} from '../../model';
import {getOrders, updateOrder} from '../../services/woo.commerce.endpoints';
import { POLL_DELAY } from '../../constants'
const log = console.log;
// const log = (_message?: any, ..._optionalParams: any[]) => {};

export const persistKeys: Array<string> = [
  'filter',
  'seenOrderIds',
  'notifications',
];

type OrdersResponseObject = {hash: string; orders: OrderSnap[]};

function createRespnseObjFromOrders(
  orders: OrderSnap[],
): OrdersResponseObject | undefined {
  if (orders.length) {
    return {
      hash: orders.map((order) => order.id.toString()).join(''),
      orders,
    };
  }
}

export const OrdersStore = types
  .model('OrdersStore', {
    requestBase: APIRequestBase,
    updatingOrderIds: types.optional(types.array(types.number), []),
    seenOrderIds: types.optional(OrderIds, []),
    orders: OrdersArray,
    state: LoadingState,
    error: types.maybeNull(ErrorModel),
    lastUpdateDate: types.maybeNull(types.Date),
    notifications: NotificationsArray,
    filter: Filter,
    pollDelay: types.optional(types.number, POLL_DELAY),
    itemsPerPage: types.optional(types.number, 100),
  })
  .views((self) => ({
    get currentFilter(): (order: Order) => boolean {
      switch (self.filter) {
        case filterValues.LAST24_HOURS: {
          return isWithinTheLast24Hours;
        }
      }
      return (_: Order) => true;
    },
  }))
  .views((self) => {
    return {
      isSeen(order: Order) {
        return isCompleted(order) || self.seenOrderIds.includes(order.id);
      },
      getOrder(orderNumber: number): Order | undefined {
        return self.orders.find(({id}) => id === orderNumber);
      },
    };
  })
  .actions((self) => {
    let _isFirstUpdate = true;
    return {
      updateOrders(orders: Order[]) {
        let newOrders: Order[] = [];
        let updatedOrderIds: number[] = [];
        const previousOrderIds = self.orders.map(({id}) => id);
        orders.forEach((current) => {
          const prev = self.orders.find(({id}) => current.id === id);
          if (!prev) {
            newOrders.push(current);
          } else if (prev.status !== current.status) {
            log(`Updaing Order ${current.id}, ${current.status}`);
            prev.status = current.status;
            updatedOrderIds.push(current.id);
          }
        });
        if (newOrders.length) {
          if (_isFirstUpdate) {
            log(`Pushing First Time ${newOrders.length}`);
            self.orders.unshift(...newOrders);
          } else {
            log(`Updaing orders ${newOrders.map((order) => order.id)}`);
            self.orders.unshift(
              ...newOrders.map((order) => {
                if (!isCompleted(order)) {
                  return {
                    ...order,
                    isNew: true,
                  };
                } else {
                  return order;
                }
              }),
            );
          }
        }
        const isFirstUpdate = _isFirstUpdate;
        if (_isFirstUpdate) {
          _isFirstUpdate = false;
        }
        self.lastUpdateDate = types.Date.create(Date.now());
        return {newOrders, updatedOrderIds, previousOrderIds, isFirstUpdate};
      },
      willUpdate(silently: boolean) {
        self.state = silently
          ? loadingStateValues.PENDING_SILENTLY
          : loadingStateValues.PENDING;
      },
      setFilter(filter: Instance<typeof Filter>) {
        if (Filter.is(filter)) {
          self.filter = filter;
        } else {
          log(`Failed settinga value: ${filter} as filter)}`);
        }
      },
      setSeen(order: Order) {
        if (!isCompleted(order) && !self.seenOrderIds.includes(order.id)) {
          self.seenOrderIds.push(order.id);
          const MAX_SIZE = 300;
          const excess = self.seenOrderIds.length - MAX_SIZE;
          if (excess > 0) {
            self.seenOrderIds.splice(MAX_SIZE, excess);
          }
          self.seenOrderIds.pop;
          order.isNew = false;
          pauseSound();
        }
      },
      setDone(
        result:
          | {type: 'success'; delta: number}
          | {type: 'failed'; error: ErrorType; logs: string[]; success?: any},
      ) {
        if (result.type === 'failed') {
          self.state = loadingStateValues.ERROR;
          self.error = result.error;
          log('Fetch Orders Failed', result.logs);
        } else {
          self.state = loadingStateValues.DONE;
          const wasSilent = self.state === loadingStateValues.PENDING_SILENTLY;
          log(
            `${wasSilent ? 'Silently' : 'Successfully'} Fetched Orders since ${
              wasSilent ? `${result.delta} ms` : ''
            }`,
          );
        }
      },
    };
  })
  .actions((self) => {
    let lastResponseObj: undefined | OrdersResponseObject;
    let prevTime = 0;
    function handlePostUpdate({
      isFirstUpdate,
      newOrders,
    }: {
      isFirstUpdate: boolean;
      newOrders: Order[];
    }) {
      if (
        !isFirstUpdate &&
        newOrders.filter((order) => !isCompleted(order)).length > 0
      ) {
        playSound();
      }
    }

    const fetchOrders = flow(function* (silently: boolean = false) {
      let logs: string[] = [];
      switch (self.state) {
        // point of exit if already updating:
        case loadingStateValues.PENDING:
        case loadingStateValues.PENDING_MORE: {
          log('Already fetching message');
          return;
        }
        // If already updating silently and it's not a silent request, just change the state:
        case loadingStateValues.PENDING_SILENTLY: {
          if (!silently) {
            self.state = loadingStateValues.PENDING;
          }
          return;
        }
        case loadingStateValues.ERROR: {
          logs.push('settings error to null');
          self.error = null;
          break;
        }
      }
      const per_page = self.itemsPerPage;
      const orderby = 'id';
      const order = 'desc';

      self.willUpdate(silently);

      try {
        const orders = yield getOrders(
          {orderby, per_page, order},
          self.requestBase,
        );
        const _lastResponseObj = createRespnseObjFromOrders(orders);
        if (_lastResponseObj?.hash === lastResponseObj?.hash) {
          logs.push('Done, no new orders, setting state to DONE');
        } else {
          logs.push('Done, setting orders and updaing state to DONE');
          lastResponseObj = _lastResponseObj;
          const update = self.updateOrders(orders);
          handlePostUpdate(update);
        }
        const delta = Date.now() - prevTime;
        prevTime = Date.now();
        self.setDone({
          type: 'success',
          delta,
        });
      } catch (error) {
        self.setDone({
          type: 'failed',
          error: {
            errorType: errorTypes.NETOWRK_ERROR,
            message: error.message || 'unknown',
          },
          logs: [...logs, `Request failed, ${error.message || 'unknown'}`],
        });
      }
    });
    return {
      fetchOrders,
      toggleOrderStatus: flow(function* (order: Order) {
        let logs: string[] = [];
        if (self.updatingOrderIds.includes(order.id)) {
          return;
        }
        self.updatingOrderIds.push(order.id);
        const initialStatus = order.status;
        const status =
          order.status !== OrderStatus.completed
            ? OrderStatus.completed
            : OrderStatus.processing;

        try {
          order.status = status;
          logs.push('Calling update API');
          yield updateOrder(
            {
              orderNumber: order.id,
              status,
            },
            self.requestBase,
          );
          logs.push('Reloading orders API');
          yield fetchOrders(true);
        } catch (error) {
          logs.push(
            `Failed updating order, ${error.message}, reverting change`,
          );
          order.status = initialStatus;
        } finally {
          log(`Optimistically updaing Order ${order.id} to ${status}`);
          logs.forEach((item) => log(` ${item}`));
          self.updatingOrderIds.remove(order.id);
        }
      }),
    };
  })
  .actions((self) => {
    let nextFetchOrdersCall: null | ReturnType<typeof setTimeout> = null;
    const handleStateUpdate = flow(function* (
      state: Instance<typeof LoadingState>,
    ) {
      switch (state) {
        case loadingStateValues.ERROR:
        case loadingStateValues.DONE: {
          if (nextFetchOrdersCall === null) {
            nextFetchOrdersCall = setTimeout(() => {
              clearTimeout(
                nextFetchOrdersCall as ReturnType<typeof setTimeout>,
              );
              nextFetchOrdersCall = null;
              self.fetchOrders(true);
            }, self.pollDelay);
            log(`Scheduling silent get orders in ${self.pollDelay} ms`);
          }
          break;
        }
      }
    });

    return {
      afterCreate() {
        addDisposer(
          self,
          reaction(() => self.state, handleStateUpdate),
        );
      },
      beforeDestroy() {
        if (nextFetchOrdersCall) {
          clearTimeout(nextFetchOrdersCall);
        }
      },
    };
  })
  .views((self) => ({
    get isRefresing(): boolean {
      switch (self.state) {
        case loadingStateValues.PENDING:
        case loadingStateValues.PENDING_MORE: {
          return true;
        }
        default: {
          return false;
        }
      }
    },
    get closedOrdersSections(): ClosedItemsSection[] {
      const sections: {key: string; title: string; data: Order[]}[] = [];
      self.orders.forEach((order) => {
        if (isCompleted(order)) {
          const key = timeFromNow(order);
          const section = sections.find((s) => s.key === key);
          if (section) {
            section.data.push(order);
          } else {
            sections.push({key, title: key, data: [order]});
          }
        }
      });
      return sections;
    },
    get filteredOpenOrders() {
      return self.orders.filter(
        (order) => isOpen(order) && self.currentFilter(order),
      );
    },
    get invisibleOpenOrders() {
      return self.orders.filter(
        (order) => isOpen(order) && !self.currentFilter(order),
      );
    },
    get ids() {
      return self.orders.map(getId);
    },
  }))
  .views((self) => ({
    get openOrdersView(): OpenOrdersView {
      return {
        filter: self.filter,
        error: self.error,
        fetch: self.fetchOrders,
        refreshing: self.isRefresing,
        items: self.filteredOpenOrders,
      };
    },
    get closedOrdersView(): ClosedOrdersView {
      return {
        sections: self.closedOrdersSections,
        error: self.error,
        refreshing: self.isRefresing,
        fetch: self.fetchOrders,
      };
    },
  }));

export type IOrdersStore = Instance<typeof OrdersStore>;
export type StoreInSnapshot = SnapshotIn<typeof OrdersStore>;
export type StoreOutSnapshot = SnapshotOut<typeof OrdersStore>;

export const initialSnapsot: Partial<StoreInSnapshot> = {
  state: loadingStateValues.IDLE,
  orders: [],
  seenOrderIds: [],
  filter: filterValues.LAST24_HOURS,
};

export function hasDataToPersist(store: IOrdersStore | Object): boolean {
  return Object.keys(pick(store, persistKeys)).length !== 0;
}

export function dataToPersist(store: IOrdersStore) {
  return JSON.stringify(pick(store, persistKeys) || {});
}

// export function restoreFromPersistnce(data: {}): [StoreInSnapshot, string[]] {
//   const snapshot = initialSnapsot;
//   const logs: string[] = [];
//   let restoredItems = Array<string>();
//   persistKeys.forEach((key) => {
//     if (key in data) {
//       if (key in OrdersStore.properties == false) {
//         logs.push(`Store has no key: ${key}`);
//         return;
//       }
//       const value = data[key];
//       if (!OrdersStore.properties[key].is(value)) {
//         logs.push(`Store does not accecpts ${value} for key: ${key}`);
//         return;
//       }
//       restoredItems.push(key);
//       snapshot[key] = data[key];
//     }
//   });
//   if (restoredItems.length === 0) {
//     logs.push('No items found in storage');
//   } else {
//     logs.push(`Restored from storage keys: ${restoredItems.join(',')}`);
//   }

//   snapshot.state = loadingStateValues.IDLE;
//   return [snapshot, logs];
// }

export function restoreFromPersistence(data: {}): Partial<StoreInSnapshot> {
  const snapshot = initialSnapsot;
  persistKeys.forEach((key) => {
    if (key in data) {
      snapshot[key] = data[key];
    }
  });
  snapshot.state = loadingStateValues.IDLE;

  return snapshot;
}
