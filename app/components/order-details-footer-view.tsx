import React from 'react';
import {View, Text} from 'react-native';
import {Order} from '../types';
import styles from '../styles';

export function OrderDetailsFooterView({order}: {order: Order}) {
  return (
    <View style={styles.detailTaxesTotalContainer}>
      <Text style={styles.detailTaxesTotal}>TAXES: {`${order.total_tax}`}</Text>
      <Text style={styles.detailTaxesTotal}>TOTAL: {`${order.total}`}</Text>
    </View>
  );
}
