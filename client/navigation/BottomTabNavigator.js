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
  const INITIAL_ROUTE_NAME = 'Home';

  function Home({ navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>her</Text>
        <Button
          title="Go to Wojciech's profile"
          onPress={() =>
            navigation.navigate("Home", { id: "Wojciech", age: 22 })
          }
        />
        <Button
          title="Go to unknown profile"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    );
  }

  function Profile({ route }) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hello {route.params?.id || "Unknown"}!</Text>
        <Text>
          Type of age parameter is{" "}
          {route.params?.age ? typeof route.params.age : "undefined"}
        </Text>
      </View>
    );
  }

  function Settings({ route, navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hello {route.params?.id || "Unknown"}!</Text>
        <Text>
          Type of age parameter is{" "}
          {route.params?.age ? route.params.age : "undefined"}
        </Text>
      </View>
    );
  }

  const HomeStack = () => {
    const MyStack = createStackNavigator();

    return (
      <MyStack.Navigator>
        <MyStack.Screen
          name="Home"
          component={HomeScreen}
        />
        <MyStack.Screen name="Profile" component={Home} />
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
    )
  }

  const MyTabs = createBottomTabNavigator();
  return (
    <MyTabs.Navigator
      tabBarOptions={{ showLabel: false }}
    >
      <MyTabs.Screen
        name="HomeStack"
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
        component={NearByMap}
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-navigate" />,
          tabBarOnPress: ({ navigation, defaultHandler }) => {
            console.log('this will be fired just before nagivation happens')
            defaultHandler() // if you omit this, navigation will not happen
          }
        }}
      />
    </MyTabs.Navigator>
  );
}
