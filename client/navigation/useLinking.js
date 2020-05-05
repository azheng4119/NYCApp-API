import { useLinking } from '@react-navigation/native';

export default function(containerRef) {
  return useLinking(containerRef, {
    prefixes: ['/'],
    config: {
      HomeStack: {
        path: "stack",
        initialRouteName: "Profile",
        screens: {
          Home: "home",
          Profile: {
            path: "user/:id/:age",
            parse: {
              id: id => `there, ${id}`,
              age: Number
            }
          }
        }
      },
      Train:{
        path: "Trains",
        initialRouteName: "Trains",
        screens: {
          Trains: "train",
          SingleTrain: "singleTrain",
          SingleStation: "singleStation"
        }
      },
      Map: "settings"
    },
  });
}
