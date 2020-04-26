import React, { useState, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, ScrollView, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import Images from '../assets/images';
import Loading from '../components/Loading';
import { Favorites } from '../components/Favorites';
import Geolocation from '@react-native-community/geolocation';

export default function HomeScreen({
  navigation
}) {
  const [nearBy, setNearBy] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      async function fetchData() {
        getNearBy();
      }
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getNearBy();
    console.log("here")
  }, []);

  const getNearBy = async () => {
    try {
      await Geolocation.getCurrentPosition(
				position => {
					const initialPosition = JSON.stringify(position);
					const location = JSON.parse(initialPosition);
					const currLoc = { latitude: location[`coords`][`latitude`], longitude: location[`coords`][`longitude`] };
					searchOnCoords(currLoc);
				},
				error => Alert.alert('Error', JSON.stringify(error)),
				{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
			  );
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
                    navigation.navigate('Single', { station: station["stopName"] } )}
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
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  Loading: {
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