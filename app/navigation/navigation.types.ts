import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
  HomeStack: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Details: {
    orderNumber: number;
  };
};

export type DetailsScreenRouteProp = RouteProp<HomeStackParamList, 'Details'>;

export type DetailsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'Details'
>;
