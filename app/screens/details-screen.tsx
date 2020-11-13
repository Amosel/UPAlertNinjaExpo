/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {SafeAreaView, Text, View, FlatList, Image} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import styles, {colors} from '../styles';
import {useOrdersStore} from '../provider';
import {observer} from 'mobx-react';
import {
  LineItemView,
  OrderDetailsHeaderView,
  OrderDetailsFooterView,
} from '../components';
import {DetailsScreenRouteProp} from '../navigation/navigation.types';
import {isCompleted} from '../model';

function DetailsScreenHeader() {
  return (
    <View>
      <Image
        style={styles.imageSMLogo}
        source={require('../assets/logo-small.png')}
      />
      <Text style={styles.logoText}>ORDER DETAIL</Text>
    </View>
  );
}

export const DetailsScreen = observer(() => {
  const {goBack} = useNavigation();
  const {orderNumber} = useRoute<DetailsScreenRouteProp>().params;
  const {
    setSeen,
    getOrder,
    toggleOrderStatus,
    updatingOrderIds,
  } = useOrdersStore();
  const order = getOrder(orderNumber)!;
  const isComplete = isCompleted(order);

  React.useEffect(() => {
    setSeen(order);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.PRIMARYBGCOLOR}}>
      <DetailsScreenHeader />
      <View style={styles.container}>
        <View style={styles.detailOrdersContainer}>
          <FlatList
            ListHeaderComponent={<OrderDetailsHeaderView order={order} />}
            data={order.line_items.toJSON()}
            renderItem={({item, index}) => (
              <LineItemView lineItem={item} index={index} />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <OrderDetailsFooterView order={order} />
        </View>
        <Button
          loading={updatingOrderIds.includes(order.id)}
          buttonStyle={[styles.detailButton]}
          title={isComplete ? 'REOPEN ORDER' : 'MARK ORDER COMPLETE'}
          type="solid"
          onPress={() => {
            toggleOrderStatus(order);
            goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
});
