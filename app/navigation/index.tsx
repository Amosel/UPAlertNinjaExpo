import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as Screens from '../screens';
import {DismissButton, SettingsButton} from '../components';
import {colors} from '../styles';
import {useCredentials} from '../provider';
import {observer} from 'mobx-react';

function HomeStack() {
  const {Screen, Navigator} = createStackNavigator();
  return (
    <Navigator>
      <Screen
        name="Home"
        component={Screens.HomeScreen}
        options={{
          title: 'Orders',
          headerRight: () => <SettingsButton />,
          headerTintColor: colors.WHITE,
          headerBackTitle: undefined,
          headerStyle: {
            backgroundColor: colors.PRIMARYBGCOLOR,
            borderBottomWidth: 0,
          },
        }}
      />
      <Screen
        name="Details"
        component={Screens.DetailsScreen}
        options={{
          headerTintColor: colors.WHITE,
          headerBackTitle: undefined,
          headerStyle: {
            backgroundColor: colors.PRIMARYBGCOLOR,
            borderBottomWidth: 0,
          },
        }}
      />
    </Navigator>
  );
}

function SettingsStack() {
  const {Screen, Navigator} = createStackNavigator();
  return (
    <Navigator>
      <Screen
        name="SettingsHome"
        component={Screens.SettingsScreen}
        options={{
          headerRight: () => <DismissButton />,
          headerTintColor: colors.WHITE,
          headerBackTitle: undefined,
          headerStyle: {
            backgroundColor: colors.PRIMARYBGCOLOR,
          },
          headerLeft: undefined,
        }}
      />
      <Screen
        name="PrivacyPolicy"
        component={Screens.PrivacyPolicyScreen}
        options={{
          headerTintColor: colors.WHITE,
          headerBackTitle: undefined,
          headerStyle: {
            backgroundColor: colors.PRIMARYBGCOLOR,
            borderBottomWidth: 0,
          },
        }}
      />
    </Navigator>
  );
}

function AppStack() {
  const {Screen, Navigator} = createStackNavigator();
  return (
    <Navigator mode="modal" screenOptions={{}}>
      <Screen
        name={'Home'}
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Screen
        name={'Settings'}
        component={SettingsStack}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}

export const Root = observer(() => {
  const {Navigator, Screen} = createStackNavigator();
  const credentials = useCredentials();
  return (
    <NavigationContainer>
      <Navigator mode="modal">
        {credentials ? (
          <Screen
            name={'HomeStack'}
            component={AppStack}
            options={{headerShown: false}}
          />
        ) : (
          <Screen
            name={'Settings'}
            component={Screens.SettingsScreen}
            options={{headerShown: false}}
          />
        )}
      </Navigator>
    </NavigationContainer>
  );
});
