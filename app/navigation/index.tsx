import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as Screens from '../screens';
import {DismissButton, SettingsButton, LogoTitle} from '../components';
import {colors} from '../styles';
import {useCredentials} from '../provider';
import {observer} from 'mobx-react';

function OrdersStack() {
  const {Screen, Navigator} = createStackNavigator();
  return (
    <Navigator>
      <Screen
        name="Orders"
        component={Screens.HomeScreen}
        options={{
          headerRight: () => <SettingsButton />,
          headerTintColor: colors.WHITE,
          headerBackTitle: undefined,
          headerStyle: {
            backgroundColor: colors.PRIMARYBGCOLOR,
            borderBottomWidth: 0,
          },
          headerTitle: () => <LogoTitle />,
        }}
      />
      <Screen
        name="Details"
        component={Screens.DetailsScreen}
        options={{
          headerTintColor: colors.WHITE,
          headerStyle: {
            backgroundColor: colors.PRIMARYBGCOLOR,
            borderBottomWidth: 0,
          },
          headerTitle: () => <LogoTitle />,
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
        name="Settings"
        component={Screens.SettingsScreen}
        options={{
          headerRight: () => <DismissButton />,
          headerLeft: () => null,
          title: '',
          headerTintColor: colors.WHITE,
          headerStyle: {
            backgroundColor: colors.PRIMARYBGCOLOR,
          },
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
        component={OrdersStack}
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
            name={'OrdersStack'}
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
