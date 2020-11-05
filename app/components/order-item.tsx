/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {observer} from 'mobx-react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Order} from '../types';
import {useOrdersStore} from '../provider';
import {getNameOnOrder, getOrderTime} from '../model';
import {colors} from '../styles';

// const log = console.log
const log = (_message?: any, ..._optionalParams: any[]) => {};

export const OrderItem = observer(
  ({
    order,
    index,
    onPress,
    highlightUnseen = false,
    blinkNew = false,
  }: {
    order: Order;
    index: number;
    onPress: () => void;
    highlightUnseen?: boolean;
    blinkNew?: boolean;
  }) => {
    const time = getOrderTime(order);
    const orderNumber = `#${order.id}`;
    const name = getNameOnOrder(order);
    const amount = `$${order.total}`;
    const store = useOrdersStore();
    const seen = highlightUnseen ? store.isSeen(order) : true;
    const blink = blinkNew && order.isNew;
    log(`Rendering item ${order.id}`);
    return (
      <TouchableOpacity
        style={[
          {
            paddingVertical: '3.5%',
            paddingHorizontal: '4%',
            backgroundColor: index % 2 === 1 ? colors.LIGHT_GRAY : colors.WHITE,
          },
          blink
            ? {
                borderWidth: 3,
                borderColor: colors.PRIMARYBGCOLOR,
              }
            : {},
        ]}
        onPress={onPress}>
        <View
          style={{
            paddingVertical: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: colors.BUTTONBGCOLOR,
              fontSize: 22,
              fontWeight: seen ? '500' : 'bold',
            }}>
            {time}
          </Text>
          <Text
            style={{
              color: colors.BUTTONBGCOLOR,
              fontSize: 22,
              fontWeight: seen ? '500' : 'bold',
            }}>
            {name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: colors.BUTTONBGCOLOR,
              fontSize: 17,
            }}>
            {orderNumber}
          </Text>
          <Text
            style={{
              color: colors.BUTTONBGCOLOR,
              fontSize: 17,
            }}>
            {amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
