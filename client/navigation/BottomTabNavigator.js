import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen'
import AllTrains from '../screens/AllTrains';
import SingleTrain from '../screens/SingleTrain';
import SingleStation from '../screens/SingleStation';
import NearByMap from '../screens/NearByMap';

export default function App() {

  const HomeStack = () => {
    const MyStack = createStackNavigator();

    return (
      <MyStack.Navigator
        initialRouteName="Home"
      >
        <MyStack.Screen
          name="Home"
          component={HomeScreen}
        />
        <MyStack.Screen
          name="Single"
          component={SingleStation}
        />
      </MyStack.Navigator>
    );
  };

  const TrainStack = () => {
    const MyStack = createStackNavigator();

    return (
      <MyStack.Navigator
        initialRouteName="Trains"
      >
        <MyStack.Screen
          name="Trains"
          component={AllTrains}
        />
        <MyStack.Screen
          name="SingleTrain"
          component={SingleTrain}
        />
        <MyStack.Screen
          name="SingleStation"
          component={SingleStation}
        />
      </MyStack.Navigator>
    );
  };

  const MapStack = () => {
    const MyStack = createStackNavigator();

    return (
      <MyStack.Navigator
        initialRouteName="NearByMap"
      >
        <MyStack.Screen
          name="NearByMap"
          component={NearByMap}
        />
        <MyStack.Screen
          name="SingleStation"
          component={SingleStation}
        />
      </MyStack.Navigator>
    );
  };

  const MyTabs = createBottomTabNavigator();
  return (
    <MyTabs.Navigator
      tabBarOptions={{ showLabel: false }}
    >
      <MyTabs.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-home" />,
        }}
      />
      <MyTabs.Screen
        name="Train"
        component={TrainStack}
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-train" />,
        }}
      />
      <MyTabs.Screen
        name="Map"
        component={MapStack}
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-navigate" />,
        }}
      />
    </MyTabs.Navigator>
  );
}
