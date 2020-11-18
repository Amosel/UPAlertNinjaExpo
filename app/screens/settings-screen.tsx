/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {observer} from 'mobx-react';
import {useKeyboard} from '../hooks';
import {CredentialsInputView} from '../components/credentials-input-view';
import {VersionView} from '../components/version-view';
import styles, {colors} from '../styles';
import {useCredentialForm} from '../hooks';
import {Branding} from '../components';

export const SettingsScreen = observer(() => {
  const keyboardIsShowing = useKeyboard();
  const {userInput, handleChange, canSave, onPress} = useCredentialForm();
  const {navigate, canGoBack, goBack} = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.PRIMARYBGCOLOR}}>
      <View style={styles.container}>
        <KeyboardAvoidingScrollView keyboardDismissMode="on-drag">
          {keyboardIsShowing ? null : (
            <View style={styles.imageContainer}>
              <Branding />
            </View>
          )}
          <CredentialsInputView {...{handleChange, userInput}} />
          <Button
            disabled={!canSave}
            style={styles.settingsButton}
            titleStyle={{
              color: 'white',
            }}
            title="SAVE SETTINGS"
            type="solid"
            onPress={() => {
              if (canGoBack()) {
                goBack();
              }
              onPress();
            }}
          />
        </KeyboardAvoidingScrollView>
      </View>
      <Text
        style={[
          styles.body,
          {
            padding: '5%',
            textDecorationLine: 'underline',
            color: colors.BUTTONBGCOLOR,
          },
        ]}
        onPress={() => navigate('PrivacyPolicy')}>
        Privacy Policy
      </Text>
      <VersionView />
    </SafeAreaView>
  );
});
