import {types, Instance, SnapshotIn} from 'mobx-state-tree';
import {
  phone_number,
  consumer_key,
  consumer_secret,
  base_url,
} from '../constants';

const BackendDate = types.custom<Date, string>({
  name: 'BackendDate',
  fromSnapshot(snapshot) {
    return snapshot.toUTCString();
  },
  toSnapshot(value) {
    return new Date(value);
  },
  getValidationMessage() {
    return 'message';
  },
  isTargetType(value) {
    return typeof value === 'string';
  },
});

const Link = types.model('Link', {
  href: types.string,
});

export const Links = types.model('Links', {
  self: types.array(Link),
  collection: types.array(Link),
  customer: types.array(Link),
});

const Tax = types.model('Tax', {
  id: types.number,
  total: types.string,
  subtotal: types.string,
});

const Metadata = types.model('Metadatum', {
  id: types.number,
  key: types.string,
  value: types.string,
});

const Taxline = types.model('Taxline', {
  id: types.number,
  rate_code: types.string,
  rate_id: types.number,
  label: types.string,
  compound: types.boolean,
  tax_total: types.string,
  shipping_tax_total: types.string,
  rate_percent: types.number,
  meta_data: types.array(types.string),
});

const LineItem = types.model('LineItem', {
  id: types.number,
  name: types.string,
  product_id: types.number,
  variation_id: types.number,
  quantity: types.number,
  tax_class: types.string,
  subtotal: types.string,
  subtotal_tax: types.string,
  total: types.string,
  total_tax: types.string,
  taxes: types.array(Tax),
  meta_data: types.array(Metadata),
  sku: types.string,
  price: types.number,
});

const Shipping = types.model('Shipping', {
  first_name: types.string,
  last_name: types.string,
  company: types.string,
  address_1: types.string,
  address_2: types.string,
  city: types.string,
  state: types.string,
  postcode: types.string,
  country: types.string,
});

const Billing = types.model('Billing', {
  first_name: types.string,
  last_name: types.string,
  company: types.string,
  address_1: types.string,
  address_2: types.string,
  city: types.string,
  state: types.string,
  postcode: types.string,
  country: types.string,
  email: types.string,
  phone: types.string,
});

export enum OrderStatus {
  completed = 'completed',
  processing = 'processing',
  pending = 'pending',
}

export const OrderModel = types.model('OrderModel', {
  id: types.identifierNumber,
  parent_id: types.number,
  number: types.string,
  order_key: types.string,
  created_via: types.string,
  version: types.string,
  status: types.enumeration([
    OrderStatus.processing,
    OrderStatus.completed,
    OrderStatus.pending,
  ]),
  currency: types.string,
  discount_total: types.string,
  discount_tax: types.string,
  shipping_total: types.string,
  shipping_tax: types.string,
  cart_tax: types.string,
  total: types.string,
  total_tax: types.string,
  prices_include_tax: types.boolean,
  customer_id: types.number,
  customer_ip_address: types.string,
  customer_user_agent: types.string,
  customer_note: types.string,
  billing: Billing,
  shipping: Shipping,
  payment_method: types.string,
  payment_method_title: types.string,
  transaction_id: types.string,
  date_created: BackendDate,
  date_created_gmt: types.string,
  date_modified: types.string,
  date_modified_gmt: types.string,
  date_paid: types.maybeNull(types.string),
  date_paid_gmt: types.maybeNull(types.string),
  date_completed: types.maybeNull(types.string),
  date_completed_gmt: types.maybeNull(types.string),
  cart_hash: types.string,
  meta_data: types.array(Metadata),
  line_items: types.array(LineItem),
  tax_lines: types.array(Taxline),
  shipping_lines: types.array(types.string),
  fee_lines: types.array(types.string),
  coupon_lines: types.array(types.string),
  refunds: types.array(types.string),
  _links: Links,
  seen: types.optional(types.boolean, false),
  isNew: types.optional(types.boolean, false),
});

export const loadingStateValues = {
  IDLE: 'IDLE',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  PENDING_SILENTLY: 'PENDING_SILENTLY',
  PENDING_MORE: 'PENDING_MORE',
  MORE: 'MORE',
  DONE: 'DONE',
};

export const LoadingState = types.enumeration(
  'State',
  Object.values(loadingStateValues),
);

export const NotificationModel = types.model('Notification', {
  origin: types.enumeration(['selected', 'received']),
  data: types.string,
  remote: types.boolean,
  isMultiple: types.boolean,
});

export const NotificationsArray = types.array(NotificationModel);
export const OrdersArray = types.array(OrderModel);

export const errorTypes = {
  NETOWRK_ERROR: 'Network Error',
  UNKNOWN: 'Unknown',
};

export const ErrorModel = types.model('Error', {
  errorType: types.enumeration(Object.values(errorTypes)),
  message: types.string,
});

export const filterValues = {
  LAST24_HOURS: 'last24Hours',
  ALL: 'all',
};

export const APIRequestBase = types.model('APICredentials', {
  base_url: types.string,
  consumer_key: types.string,
  consumer_secret: types.string,
});

export const CredentialsBase = types.compose(
  'Credentials',
  APIRequestBase,
  types.model({
    phone_number: types.string,
  }),
);

export type RequestBase = Instance<typeof APIRequestBase>;
export type Credentials = SnapshotIn<typeof CredentialsBase>;

export type CredentialEntryName =
  | typeof phone_number
  | typeof consumer_key
  | typeof consumer_secret
  | typeof base_url;

export type GetOrdersParams = {
  status?: OrderStatus;
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug';
  per_page?: number;
  order?: 'asc' | 'desc';
  before?: Date;
  after?: Date;
};

export interface WebHook {
  id: number;
  name: string;
  status: string;
  topic: string;
  resource: string;
  event: string;
  hooks: string[];
  delivery_url: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  _links: Instance<typeof Links>;
}

export const Filter = types.enumeration(Object.values(filterValues));
export type FilterValue = Instance<typeof Filter>;
export const OrderIds = types.array(types.number);
export type Order = Instance<typeof OrderModel>;
export type OrderSnap = SnapshotIn<typeof OrderModel>;
export type OrderFilter = Instance<typeof Filter>;
export type OrderLineItem = Instance<typeof LineItem>;
export type OrderLoadingState = Instance<typeof LoadingState>;
export type Notification = Instance<typeof NotificationModel>;
export type ErrorType = Instance<typeof ErrorModel>;

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
  expoToken?: string;
  apnToken?: string;
};

export type PartialUser = Partial<UserObject>;
