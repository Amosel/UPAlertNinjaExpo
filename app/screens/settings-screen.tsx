/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView, Image, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from 'react-navigation-hooks';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {observer} from 'mobx-react';
import {useKeyboard} from '../hooks';
import {CredentialsInputView} from '../components/credentials-input-view';
import {VersionView} from '../components/version-view';
import styles, {colors} from '../styles';
import {useCredentialForm} from '../hooks';

export const SettingsScreen = observer(() => {
  const keyboardIsShowing = useKeyboard();
  const {userInput, handleChange, canSave, onPress} = useCredentialForm();
  const {dismiss, navigate} = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.PRIMARYBGCOLOR}}>
      <View style={styles.container}>
        <KeyboardAvoidingScrollView keyboardDismissMode="on-drag">
          {keyboardIsShowing ? null : (
            <View style={styles.imageContainer}>
              <Image
                style={styles.imageLogo}
                source={require('../assets/logo.png')}
              />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.textTitle}>Restaurant</Text>
            <Text style={styles.textSubTitle}>NINJA</Text>
          </View>
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
              onPress();
              dismiss();
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
