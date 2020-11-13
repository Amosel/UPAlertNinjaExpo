import axios from 'axios';
import {OrderSnap} from '../types';
import {OrderStatus, WebHook, RequestBase, GetOrdersParams} from '../types';

const log = console.log;
// const log = (_message?: any, ..._optionalParams: any[]) => {};

const get = <T>(url: string) => {
  log(`GET: ${url}`);
  return axios.get<T>(url);
};

const put = (url: string, data?: any) => {
  log(`PUT: ${url}, ${JSON.stringify(data, null, 2)}`);
  return axios.put(url, data);
};

const post = <T>(url: string, data?: any) => {
  log(`POST: ${url}, ${JSON.stringify(data, null, 2)}`);
  return axios.post(url, data);
};

export const getOrder = (
  orderNumber: number,
  {base_url, consumer_key, consumer_secret}: RequestBase,
) => {
  return get<OrderSnap>(
    `${base_url}/orders/${orderNumber}/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
  );
};

export const getOrders = (
  {orderby = 'id', per_page = 100, order = 'desc', ...rest}: GetOrdersParams,
  {base_url, consumer_key, consumer_secret}: RequestBase,
): Promise<OrderSnap[]> => {
  let queryEnd = `&orderby=${orderby}&order=${order}&per_page=${per_page}`;
  if (rest.status) {
    queryEnd += `&status=${rest.status}`;
  }
  if (rest.after) {
    queryEnd += `&after=${rest.after.toISOString()}`;
  }
  if (rest.before) {
    queryEnd += `&before=${rest.before.toISOString()}`;
  }
  let url = `${base_url}/orders/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}${queryEnd}`;
  return get<{}[]>(url).then((response) => response.data as OrderSnap[]);
};

export const updateOrder = (
  {orderNumber, status}: {orderNumber: number; status: OrderStatus},
  {base_url, consumer_key, consumer_secret}: RequestBase,
) =>
  put(
    `${base_url}/orders/${orderNumber}/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
    {
      status,
    },
  );

export const getWebhooks = ({
  base_url,
  consumer_key,
  consumer_secret,
}: RequestBase) =>
  get<WebHook[]>(
    `${base_url}/webhooks/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
  );

export const createWebhook = (
  webhook: {
    name: string;
    topic: string;
    delivery_url: string;
  },
  {base_url, consumer_key, consumer_secret}: RequestBase,
) =>
  post(
    `${base_url}/webhooks/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
    webhook,
  );
