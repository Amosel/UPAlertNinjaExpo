import React from 'react';
import {TextInput, View} from 'react-native';
import styles from '../styles';
import {Credentials, CredentialEntryName} from '../types';
import {observer} from 'mobx-react';

export const CredentialsInputView = observer(
  ({
    userInput,
    handleChange,
  }: {
    userInput: Credentials;
    handleChange: (entry: CredentialEntryName) => (input: string) => void;
  }) => {
    const phone_numberTextInputRef = React.useRef<TextInput>();
    const apiKeyTextInputRef = React.useRef<TextInput>();
    const consumer_secretTextInputRef = React.useRef<TextInput>();
    const UrlTextInputRef = React.useRef<TextInput>();

    return (
      <View>
        <TextInput
          ref={phone_numberTextInputRef}
          style={styles.inputPhone}
          value={userInput.phone_number}
          onChangeText={handleChange('phone_number')}
          onEndEditing={() => {
            if (apiKeyTextInputRef.current) {
              apiKeyTextInputRef.current.focus();
            }
          }}
          placeholder="Phone Number"
        />
        <TextInput
          ref={apiKeyTextInputRef}
          style={styles.inputAPI}
          value={userInput.consumer_key}
          onChangeText={handleChange('consumer_key')}
          placeholder="API Key"
          onEndEditing={() => {
            if (consumer_secretTextInputRef.current) {
              consumer_secretTextInputRef.current.focus();
            }
          }}
        />
        <TextInput
          ref={consumer_secretTextInputRef}
          style={styles.inputSecret}
          value={userInput.consumer_secret}
          onChangeText={handleChange('consumer_secret')}
          placeholder="Secret Key"
          onEndEditing={() => {
            if (UrlTextInputRef.current) {
              UrlTextInputRef.current.focus();
            }
          }}
        />
        <TextInput
          ref={UrlTextInputRef}
          style={styles.inputURL}
          value={userInput.base_url}
          onChangeText={handleChange('base_url')}
          placeholder="WooCommerce URL"
        />
      </View>
    );
  },
);
