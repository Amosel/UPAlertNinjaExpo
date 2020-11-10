/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SectionList, FlatList, View, Text} from 'react-native';
import {OrderKeyExtractor} from '../model';
import {OrderItem} from './order-item';
import styles, {colors} from '../styles';
import {OrderListEmptyComponent} from './empty-orders-list-view';
import {useNavigation} from '@react-navigation/native';
import {OrderFilterButton} from './order-filter-button';
import {observer} from 'mobx-react';
import {useOrdersStore} from '../provider';
import {filterValues} from '../types';

function ClosedOrdersListSection({title}) {
  return (
    <View style={{backgroundColor: colors.PRIMARYBGCOLOR}}>
      <Text
        style={[
          styles.header,
          {
            color: colors.WHITE,
            paddingHorizontal: '4%',
            paddingVertical: 5,
          },
        ]}>
        {title}
      </Text>
    </View>
  );
}

function OrderItemSeparator() {
  return <View style={styles.listSeparator} />;
}
export const ClosedOrdersList = observer(() => {
  const store = useOrdersStore();
  const {sections, refreshing, fetch} = store.closedOrdersView;
  const {navigate} = useNavigation();
  return (
    <SectionList
      contentContainerStyle={{flexGrow: 1}}
      style={{flex: 1}}
      ItemSeparatorComponent={() => <OrderItemSeparator />}
      ListEmptyComponent={<OrderListEmptyComponent />}
      sections={sections}
      renderItem={({item: order, index}) => (
        <OrderItem
          order={order}
          index={index}
          onPress={() => navigate('Details', {orderNumber: order.id})}
        />
      )}
      renderSectionHeader={({section: {title}}) => (
        <ClosedOrdersListSection title={title} />
      )}
      keyExtractor={OrderKeyExtractor}
      refreshing={refreshing && sections.length !== 0}
      onRefresh={fetch}
    />
  );
});

export const OpenOrderList = observer(() => {
  const store = useOrdersStore();
  const {
    isRefresing,
    error,
    openOrdersView: {refreshing, items, fetch, filter},
  } = store;
  const {navigate} = useNavigation();
  return (
    <View style={{flexGrow: 1}}>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        style={{flex: 1}}
        ListEmptyComponent={
          <OrderListEmptyComponent
            emptyMessage={`No Orders found${
              filter === filterValues.LAST24_HOURS ? ' the last 24 hours.' : '.'
            }`}
          />
        }
        ItemSeparatorComponent={() => <OrderItemSeparator />}
        data={items}
        renderItem={({item: order, index}) => (
          <OrderItem
            order={order}
            index={index}
            onPress={() => {
              navigate('Details', {orderNumber: order.id});
            }}
            highlightUnseen
            blinkNew
          />
        )}
        keyExtractor={OrderKeyExtractor}
        refreshing={refreshing}
        onRefresh={fetch}
      />
      {!isRefresing && !error ? <OrderFilterButton /> : null}
    </View>
  );
});
