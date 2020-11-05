/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView} from 'react-native';
import {observer} from 'mobx-react';
import MaterialTabs from 'react-native-material-tabs';
import {colors} from '../styles';
import {SelectedIndex} from '../types';
import {ClosedOrdersList, OpenOrderList} from '../components/orders-list';
import {NoCredentialsComonent} from '../components/empty-orders-list-view';
import {useCredentials} from '../provider';

const HomeScreenContent = observer(
  ({selectedIndex}: {selectedIndex: SelectedIndex}) => {
    const credentials = useCredentials();
    if (!credentials) {
      return (
        <NoCredentialsComonent
          text={'Missing Store Credentials'}
          openSettingsText={'Open Settings'}
        />
      );
    } else {
      switch (selectedIndex) {
        case SelectedIndex.open: {
          return <OpenOrderList />;
        }
        case SelectedIndex.closed: {
          return <ClosedOrdersList />;
        }
      }
    }
  },
);

export function HomeScreen() {
  const [selectedIndex, setSelectedIndex] = React.useState<SelectedIndex>(
    SelectedIndex.open,
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <MaterialTabs
        items={['Open', 'Closed']}
        textStyle={{
          fontSize: 20,
        }}
        barColor={colors.PRIMARYBGCOLOR}
        indicatorColor={colors.PRIMARYBGCOLOR}
        selectedIndex={selectedIndex}
        onChange={(index: number) => setSelectedIndex(index as SelectedIndex)}
      />
      <HomeScreenContent selectedIndex={selectedIndex} />
    </SafeAreaView>
  );
}
