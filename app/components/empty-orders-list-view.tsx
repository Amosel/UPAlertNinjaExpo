import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import styles from '../styles';
import {observer} from 'mobx-react';
import {useOrdersStore} from '../provider';

function EmptyOrderListView({
  button,
  texts,
}: {
  button?: {onPress: () => void; title: string};
  texts: {text: string; style: any}[];
}) {
  return (
    <View style={styles.defaultContainer}>
      {texts.map(({text, style}) => (
        <Text key={text} style={style}>
          {text}
        </Text>
      ))}
      {button && (
        <Button
          titleStyle={styles.reloadButtonTitle}
          buttonStyle={styles.reloadButton}
          containerStyle={{}}
          title={button.title}
          onPress={button.onPress}
        />
      )}
    </View>
  );
}

export function NoCredentialsComonent({
  text,
  openSettingsText,
}: {
  text: string;
  openSettingsText: string;
}) {
  const {navigate} = useNavigation();
  return (
    <EmptyOrderListView
      texts={[{text, style: styles.body}]}
      button={{
        onPress: () => navigate('Settings'),
        title: openSettingsText,
      }}
    />
  );
}

export const OrderListEmptyComponent = observer(
  ({loadingMessage = 'Loading...', emptyMessage = 'No Orders found'}) => {
    const {isRefresing, error, fetchOrders} = useOrdersStore();
    if (isRefresing) {
      return (
        <EmptyOrderListView
          texts={[{text: loadingMessage, style: styles.paragraph}]}
        />
      );
    } else if (error) {
      return (
        <EmptyOrderListView
          texts={[{text: error.message, style: styles.body}]}
          button={{
            onPress: fetchOrders,
            title: 'Retry',
          }}
        />
      );
    } else {
      return (
        <EmptyOrderListView
          texts={[{text: emptyMessage, style: styles.body}]}
          button={{
            onPress: () => fetchOrders(),
            title: 'Reload',
          }}
        />
      );
    }
  },
);
