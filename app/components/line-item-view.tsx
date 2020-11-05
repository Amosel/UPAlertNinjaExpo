import React from 'react';
import {OrderLineItem} from '../types';
import styles, {colors} from '../styles';
import {View, Text} from 'react-native';

export function LineItemView({
  lineItem,
  index,
}: {
  lineItem: OrderLineItem;
  index: number;
}) {
  return (
    <View
      style={[
        styles.detailOrderSectionContainer,
        {backgroundColor: index % 2 === 0 ? colors.LIGHT_GRAY : colors.WHITE},
      ]}>
      <Text
        style={
          styles.detailProductName
        }>{`${lineItem.product_id} ${lineItem.name}`}</Text>
      <Text style={styles.detailQuanity}>{`${lineItem.quantity}`}</Text>
    </View>
  );
}
