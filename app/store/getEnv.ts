import Constants, {AppOwnership} from 'expo-constants';
import {EnvKeyType, EnvSnapshot} from '../types';
import {EnvironmentPayload} from '../../environment';
import {DEV, STAGING, PRODUCTION} from '../constants';

export async function getEnv(
  payload: EnvironmentPayload,
  overrideEnv?: EnvKeyType,
): Promise<EnvSnapshot> {
  if (overrideEnv) {
    return {
      ...(overrideEnv === 'production'
        ? payload.prod
        : overrideEnv === 'staging'
        ? payload.staging
        : payload.dev),
      environment: overrideEnv,
      isOverrid: true,
    };
  }
  const environment: EnvKeyType = Constants.isDevice
    ? Constants.appOwnership === AppOwnership.Standalone
      ? PRODUCTION
      : STAGING
    : DEV;

  return {
    ...(environment === 'production'
      ? payload.prod
      : environment === 'staging'
      ? payload.staging
      : payload.dev),
    environment,
  };
}
