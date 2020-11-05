import {Order, OrderFilter, ErrorType} from '../types/order.types';
import {Credentials} from './woo.commerce.api.types';

export enum SelectedIndex {
  open = 0,
  closed = 1,
}
export type ClosedItemsSection = {data: Order[]; title: string};

export type ClosedOrdersView = {
  sections: ClosedItemsSection[];
  refreshing: boolean;
  error: ErrorType | null;
  fetch: () => void;
};

export type OpenOrdersView = {
  error: ErrorType | null;
  items: Order[];
  refreshing: boolean;
  fetch: () => void;
  filter: OrderFilter;
};

export type PlatformName =
  | 'android'
  | 'android.simulator'
  | 'ios'
  | 'ios.simulator'
  | 'unknown';

export type UserObject = Credentials & {
  host: string;
  plaform: PlatformName;
  fcmToken?: string;
  apnToken?: string;
};

export type PartialUser = Partial<UserObject>;
