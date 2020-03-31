import React, { useState, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';
import Images from '../assets/images';
import Loading from '../components/Loading';
import { Favorites } from '../components/Favorites';

export default function HomeScreen({
  navigation
}) {
  const [nearBy, setNearBy] = useState([]);

  useEffect(() => {
    getNearBy();
  }, []);

  const getNearBy = async () => {
    try {
      await navigator.geolocation.getCurrentPosition(
        position => {
          const obj = JSON.stringify(position);
          const location = JSON.parse(obj);
          const currLoc = { latitude: location[`coords`][`latitude`], longitude: location[`coords`][`longitude`] };
          searchOnCoords(currLoc);
        },
        error => console.log(error.message),
        { timeout: 20000, maximumAge: 1000 }
      )
    } catch (err) {
      console.log(err)
    }
  }

  const searchOnCoords = async (currLoc) => {
    try {
      let { data } = await axios.get(`http://node-express-env.hfrpwhjwwy.us-east-2.elasticbeanstalk.com/trains/${currLoc.latitude}/${currLoc.longitude}`);
      setNearBy(data);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={styles.Container}>
      <Favorites navigation={navigation} />
      <View style={styles.SubContainer} >
        <ListItem
          title={'Nearby'}
          bottomDivider
        />
        <ScrollView>
          {nearBy.length > 0 ?
            nearBy.map((station, i) => {
              let allTrainImages = [];
              for (let train in station["dayTimeRoutes"].split(' ')) {
                allTrainImages.push(
                  <Image key={train} source={Images[station["dayTimeRoutes"].split(' ')[train]]} style={styles.Avatar} />
                )
              }
              return (
                <ListItem
                  onPress={() =>
                    navigation.navigate('Train', { screen: 'SingleStation', params: { station: station["stopName"] } })}
                  key={i}
                  leftAvatar={
                    <View style={styles.ListItem}>
                      {allTrainImages}
                    </View>
                  }
                  title={station["stopName"]}
                  titleStyle={styles.ListItemTitle}
                  bottomDivider
                />
              )
            }) :
            <View style={styles.Loading}>
              <Loading />
            </View>
          }
        </ScrollView>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "space-evenly"
  },
  SubContainer: {
    height: 210.9,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  Loading: {
    height: 158.2,
    backgroundColor: 'white'
  },
  ListItem: {
    flexDirection: "row"
  },
  ListItemTitle: {
    fontSize: 12
  },
  Avatar: {
    height: 20,
    width: 20,
  },
});
