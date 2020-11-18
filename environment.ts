/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

// ignore expo implememtation:
// import Constants from 'expo-constants';

export interface SelectedEnvironmentData {
  credentials: {
    base_url: string;
    consumer_key: string;
    consumer_secret: string;
    phone_number: string;
  };
  filter: string;
  pageSize: number;
}
export interface EnvironmentPayload {
  dev: SelectedEnvironmentData;
  staging: SelectedEnvironmentData;
  prod: SelectedEnvironmentData;
}

export const envPayload: EnvironmentPayload = {
  dev: {
    credentials: {
      base_url: 'https://pho-palace.upco.co/wp-json/wc/v2',
      consumer_key: 'ck_1cb5f7c7733d24f8a0b769f84e5eaa4b0bbec3f5',
      consumer_secret: 'cs_c7ee05f425aacc2fa81405d453efdc11bcccde70',
      phone_number: '929.309.5026',
    },
    filter: 'last24Hours',
    pageSize: 100,
  },
  staging: {
    credentials: {
      base_url: 'https://pho-palace.upco.co/wp-json/wc/v2',
      consumer_key: 'ck_1cb5f7c7733d24f8a0b769f84e5eaa4b0bbec3f5',
      consumer_secret: 'cs_c7ee05f425aacc2fa81405d453efdc11bcccde70',
      phone_number: '929.309.5026',
    },
    filter: 'last24Hours',
    pageSize: 100,
  },
  prod: {
    credentials: {
      base_url: 'https://www.phopalace.menu/wp-json/wc/v2',
      consumer_key: '',
      consumer_secret: '',
      phone_number: '',
    },
    filter: 'last24Hours',
    pageSize: 100,
  },
};
