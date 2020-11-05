import {Credentials} from '../types';

export const CredentialsHelper = {
  isValidCredentials(credentials: Credentials | null | undefined): boolean {
    return (
      !!credentials &&
      CredentialsHelper.isValidAPIKey(credentials.consumer_key) &&
      CredentialsHelper.isValidPhoneNumber(credentials.phone_number) &&
      CredentialsHelper.isValidSecretKey(credentials.consumer_secret) &&
      CredentialsHelper.isValidUrl(credentials.base_url)
    );
  },
  isValidPhoneNumber: (text: string) => text.length > 1,
  isValidAPIKey: (text: string) => text.length > 1,
  isValidSecretKey: (text: string) => text.length > 1,
  isValidUrl: (text: string) => text.length > 1,
};
