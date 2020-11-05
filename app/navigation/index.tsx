// import React from 'react';
// import {createStackNavigator} from 'react-navigation-stack';
// import {createAppContainer, createSwitchNavigator} from 'react-navigation';
// import * as Screens from '../screens';
// import {DismissButton, SettingsButton} from '../components';
// import {colors} from '../styles';

// const HomeStack = createStackNavigator({
//   Home: {
//     screen: Screens.HomeScreen,
//     navigationOptions: () => ({
//       title: 'Orders',
//       headerRight: <SettingsButton />,
//       headerTintColor: colors.WHITE,
//       headerBackTitle: null,
//       headerStyle: {
//         backgroundColor: colors.PRIMARYBGCOLOR,
//         borderBottomWidth: 0,
//       },
//     }),
//   },
//   Details: {
//     screen: Screens.DetailsScreen,
//     navigationOptions: () => ({
//       headerTintColor: colors.WHITE,
//       headerBackTitle: null,
//       headerStyle: {
//         backgroundColor: colors.PRIMARYBGCOLOR,
//         borderBottomWidth: 0,
//       },
//     }),
//   },
// });

// const SettingsStack = createStackNavigator({
//   SettingsHome: {
//     screen: Screens.SettingsScreen,
//     navigationOptions: () => ({
//       headerRight: <DismissButton />,
//       headerTintColor: colors.WHITE,
//       headerBackTitle: null,
//       headerStyle: {
//         backgroundColor: colors.PRIMARYBGCOLOR,
//       },
//     }),
//   },
//   PrivacyPolicy: {
//     screen: Screens.PrivacyPolicyScreen,
//     navigationOptions: () => ({
//       headerTintColor: colors.WHITE,
//       headerBackTitle: null,
//       headerStyle: {
//         backgroundColor: colors.PRIMARYBGCOLOR,
//         borderBottomWidth: 0,
//       },
//     }),
//   },
// });

// const AppStack = createStackNavigator(
//   {
//     Home: {
//       screen: HomeStack,
//     },
//     Settings: {screen: SettingsStack},
//   },
//   {
//     mode: 'modal',
//     headerMode: 'none',
//   },
// );

// export const Root = createAppContainer(
//   createSwitchNavigator({
//     Initial: Screens.InitializingScreen,
//     App: AppStack,
//   }),
// );
import React from 'react'
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export function Root() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
