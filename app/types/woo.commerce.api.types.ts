import {
  phone_number,
  consumer_key,
  consumer_secret,
  base_url,
} from '../constants';
import {types, Instance, SnapshotIn} from 'mobx-state-tree';
import {Links} from './order.types';

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

export enum OrderStatus {
  completed = 'completed',
  processing = 'processing',
  pending = 'pending',
}

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
