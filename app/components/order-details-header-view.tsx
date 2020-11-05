import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {Order} from '../types';
import styles from '../styles';
import {Linking} from 'react-native';
import {
  getOrderTime,
  getPhoneNumberOnOrder,
  phoneNumberFormatter,
  getFullName,
} from '../model';

function TouchableLink({
  href,
  title,
  onError = e => Alert.alert('Ouups...', e.message),
}: {
  href: string;
  title: string;
  onError?: (e: any) => void;
}) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(href).catch(onError)}>
      <Text style={styles.detailPhone}>{title}</Text>
    </TouchableOpacity>
  );
}

function TouchableNumber({order}: {order: Order}) {
  const phoneNumber = getPhoneNumberOnOrder(order);
  if (order.billing && order.billing.phone) {
    const title = `P: ${phoneNumberFormatter(phoneNumber)}`;
    const href = `tel:${phoneNumber}`;
    return <TouchableLink title={title} href={href} />;
  }
  return null;
}

function TouchableEmail({order}: {order: Order}) {
  if (order.billing && order.billing.email) {
    const title = `E: ${order.billing.email}`;
    const href = `mailto:${order.billing.email}`;
    return <TouchableLink title={title} href={href} />;
  }
  return null;
}

export function OrderDetailsHeaderView({order}: {order: Order}) {
  const time = getOrderTime(order);
  return (
    <View>
      <View style={styles.detailDateAndOrderNumCont}>
        <Text style={styles.detailDate}>{time}</Text>
        <Text style={styles.detailOrderNum}>{`${order.id}`}</Text>
      </View>
      <View style={styles.detailLastFirstContainer}>
        <Text style={styles.detailFirstLastName}>{getFullName(order)}</Text>
      </View>
      <View>
        <View style={styles.detailPEContainer}>
          <TouchableNumber order={order} />
          <TouchableEmail order={order} />
        </View>
      </View>
      {!!order.customer_note && (
        <Text
          style={
            styles.detailOrderNote
          }>{`Client Note: ${order.customer_note}`}</Text>
      )}
    </View>
  );
}
