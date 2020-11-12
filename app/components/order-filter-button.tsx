/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useActionSheet} from '@expo/react-native-action-sheet';
import styles, {colors} from '../styles';
import {observer} from 'mobx-react';
import {useOrdersStore} from '../provider';
import {filterValues, FilterValue} from '../types';

const getFilterText = (value: FilterValue): string => {
  if (value === filterValues.LAST24_HOURS) {
    return 'Show from the 24 Hours';
  } else {
    if (value !== filterValues.ALL) {
      throw new Error(
        `Expected either filterValues.LAST24_HOURS or filterValues.ALL got ${value}`,
      );
    }
    return 'Show all Orders';
  }
};

export const OrderFilterButton = observer(() => {
  const {
    invisibleOpenOrders,
    filter,
    setFilter,
    isRefresing,
  } = useOrdersStore();
  const {showActionSheetWithOptions} = useActionSheet();
  const values = Object.values(filterValues);
  const cancelButtonIndex = values.length;
  const onPress = React.useCallback(() => {
    showActionSheetWithOptions(
      {
        cancelButtonIndex,
        title: 'Select Filter',
        options: [...values.map(getFilterText), 'Cancel'],
      },
      (index) => {
        setFilter(values[index]);
      },
    );
  }, []);

  const children = React.useMemo(() => {
    switch (filter) {
      case filterValues.LAST24_HOURS: {
        return (
          <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
            {'Showing only orders from the last 24 hours\n'}
            {'There are more than '}
            {
              <Text style={{fontWeight: 'bold'}}>
                {invisibleOpenOrders.length}
              </Text>
            }
            {' past orders.'}
            {' Press to edit'}
          </Text>
        );
      }
      case 'all': {
        return (
          <Text style={[styles.body, {color: colors.BUTTONBGCOLOR}]}>
            {'Press to edit how open order are filtered'}
          </Text>
        );
      }
    }
  }, [filter]);
  return isRefresing ? null : (
    <TouchableOpacity onPress={onPress} style={{paddingVertical: 4}}>
      {children}
    </TouchableOpacity>
  );
});
