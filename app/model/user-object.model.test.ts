import {keysNeedingUpdate} from './user-object.model';

const expoToken = '11111';

describe('keysNeedingUpdate', () => {
  test('whith new field that is not there', () => {
    expect(
      keysNeedingUpdate(
        {
          base_url: 'https://pho-palace.upco.co/wp-json/wc/v2',
          consumer_key: 'ck_1cb5f7c7733d24f8a0b769f84e5eaa4b0bbec3f5',
          consumer_secret: 'cs_c7ee05f425aacc2fa81405d453efdc11bcccde70',
          host: 'pho-palace.upco.co',
          phone_number: '929.309.5026',
          plaform: 'ios',
        },
        {expoToken},
      ),
    ).toEqual(['expoToken']);
  });
  test('whith new field that is different', () => {
    expect(
      keysNeedingUpdate(
        {
          base_url: 'https://pho-palace.upco.co/wp-json/wc/v2',
          consumer_key: 'ck_1cb5f7c7733d24f8a0b769f84e5eaa4b0bbec3f5',
          consumer_secret: 'cs_c7ee05f425aacc2fa81405d453efdc11bcccde70',
          host: 'pho-palace.upco.co',
          phone_number: '929.309.5026',
          plaform: 'ios',
          expoToken: '11',
        },
        {expoToken},
      ),
    ).toEqual(['expoToken']);
  });
  test('whith new field that is same', () => {
    expect(
      keysNeedingUpdate(
        {
          base_url: 'https://pho-palace.upco.co/wp-json/wc/v2',
          consumer_key: 'ck_1cb5f7c7733d24f8a0b769f84e5eaa4b0bbec3f5',
          consumer_secret: 'cs_c7ee05f425aacc2fa81405d453efdc11bcccde70',
          host: 'pho-palace.upco.co',
          phone_number: '929.309.5026',
          plaform: 'ios',
          expoToken,
        },
        {expoToken},
      ),
    ).toEqual([]);
  });
});
