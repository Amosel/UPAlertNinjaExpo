import {
  getOrder,
  getOrders,
  updateOrder,
  getWebhooks,
  createWebhook,
} from '../woo.commerce.endpoints';
import getEnvVars from '../../../environment';
import {RequestBase, OrderStatus} from '../../types';
import axios from 'axios';

const {
  pageSize,
  credentials: {base_url, consumer_key, consumer_secret},
} = getEnvVars();
const requestBase: RequestBase = {base_url, consumer_key, consumer_secret};

describe('API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('getOrder', async () => {
    const axiosGetSpy = jest.spyOn(axios, 'get');
    const orderNumber = 1;
    getOrder(orderNumber, requestBase);
    expect(axiosGetSpy.mock.calls).toEqual([
      [
        `${base_url}/orders/${orderNumber}/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
      ],
    ]);
  });

  describe('getOrders', () => {
    test('getOrders', () => {
      const axiosGetSpy = jest.spyOn(axios, 'get');
      const status = OrderStatus.completed;
      getOrders({status}, requestBase);
      expect(axiosGetSpy.mock.calls).toEqual([
        [
          `${base_url}/orders/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}&orderby=id&order=desc&per_page=${pageSize}&status=${status}`,
        ],
      ]);
    });
    test('getOrders with before and after dates', () => {
      const axiosGetSpy = jest.spyOn(axios, 'get');
      const status = OrderStatus.completed;
      const date = new Date();
      const dateString = date.toISOString();
      getOrders({status, before: date, after: date}, requestBase);
      expect(axiosGetSpy.mock.calls).toEqual([
        [
          `${base_url}/orders/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}&orderby=id&order=desc&per_page=${pageSize}&status=${status}&after=${dateString}&before=${dateString}`,
        ],
      ]);
    });
  });
  test('getWebhooks', () => {
    const axiosGetSpy = jest.spyOn(axios, 'get');
    getWebhooks(requestBase);
    expect(axiosGetSpy.mock.calls).toEqual([
      [
        `${base_url}/webhooks/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
      ],
    ]);
  });

  test('createWebhook', () => {
    const axiosGetSpy = jest.spyOn(axios, 'post');
    const webhook = {
      name: 'webhook',
      topic: 'order.created',
      delivery_url: 'https://myrel.ay/xyz',
    };

    createWebhook(webhook, requestBase);
    expect(axiosGetSpy.mock.calls).toEqual([
      [
        `${base_url}/webhooks/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
        webhook,
      ],
    ]);
  });

  test('update order', () => {
    const axiosPutSpy = jest.spyOn(axios, 'put');
    const orderNumber = 1;
    const status = OrderStatus.completed;
    updateOrder({orderNumber, status}, requestBase);
    expect(axiosPutSpy.mock.calls).toEqual([
      [
        `${base_url}/orders/${orderNumber}/?consumer_key=${consumer_key}&consumer_secret=${consumer_secret}`,
        {
          status,
        },
      ],
    ]);
  });
});
