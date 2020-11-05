import moment from 'moment';
import {Order, OrderStatus} from '../types';

export function timeFromNow(order: Order) {
  return moment(order.date_created).fromNow();
}
export function getOrderTime(order: Order) {
  return moment(order.date_created).format('LT');
}
export function isWithinTheLast24Hours(order: Order) {
  return moment(order.date_modified).isAfter(moment().subtract(24, 'hours'));
}

export function isCompleted(order: Order) {
  return order.status === OrderStatus.completed;
}
export function isOpen(order: Order) {
  return order.status !== OrderStatus.completed;
}
export function getId(order: Order) {
  return order.id;
}

export function getFullName(order: Order) {
  return (
    order.billing &&
    `${order.billing.last_name || ''}, ${order.billing.first_name || ''}`
  );
}

export function getPhoneNumberOnOrder(order: Order) {
  return order.billing.phone || null;
}
export function getNameOnOrder(order: Order) {
  if (order.billing) {
    const {first_name, last_name} = order.billing;
    return `${first_name}, ${last_name}`;
  }
  if (order.shipping) {
    const {first_name, last_name} = order.shipping;
    return `${first_name}, ${last_name}`;
  } else {
    return 'Unknown user';
  }
}

export function OrderKeyExtractor(order: Order) {
  return order.id.toString();
}

export function phoneNumberFormatter(phoneNumber: string) {
  phoneNumber = phoneNumber.replace(/[^\d]/g, '');
  if (phoneNumber.length === 10) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  return null;
}
