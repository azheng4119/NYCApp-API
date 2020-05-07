import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AsyncStorage } from 'react-native';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Loading from '../components/Loading';
import Images from '../assets/images';
import FastImage from 'react-native-fast-image';

export const Favorites = ({ navigation }) => {

    const [favorites, setFavorites] = useState([]);
    const [train, setTrains] = useState([]);

    const getFavorites = async () => {
        try {
            const value = await AsyncStorage.getAllKeys();
            if (value !== null) {
                console.log(value)
                let allDayTimeTrains = [];
                setFavorites(value.map(station => station.split(',')[0].includes('&') ? station.split(',')[0].substring(1) : ''));
                for (let station in value) {
                    let keyPair = await AsyncStorage.getItem(`${value[station]}`);
                    allDayTimeTrains[station] = keyPair.split(',');
                }
                console.log(allDayTimeTrains)
                setTrains(allDayTimeTrains);
            } else {
                return ['No Favorites set'];
            }
        } catch (e) {
            return [];
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', e => {
            async function fetchData() {
                getFavorites();
            }
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);


    return <View style={styles.SubContainer} >
        <ListItem
            title={'Favorites'}
            bottomDivider
        />
        <ScrollView>
            {favorites.length > 0 ?
                favorites.map((station, i) => {
                    if (station === 'No Favorites set') {
                        return <ListItem
                            key={Math.random()}
                            title={station}
                        />
                    }
                    else {
                        let allTrainImages = [];
                        console.log(train[i])
                        if (train.length > 0) {
                            for (let index = 1; index < train[i].length; index++) {
                                allTrainImages.push(
                                    <FastImage key={Math.random()} source={Images[train[i][index]]} style={styles.Avatar} />
                                )
                            }
                        }
                        return (
                            <ListItem
                                onPress={() => {
                                    navigation.navigate('Single', { station: station })
                                }
                                }
                                key={Math.random()}
                                leftAvatar={
                                    <View style={styles.ListItem}>
                                        {allTrainImages}
                                    </View>
                                }
                                title={station}
                                titleStyle={styles.ListItemTitle}
                                bottomDivider
                            />
                        )
                    }
                }) :
                <View style={styles.Loading}>
                    <Loading />
                </View>
            }
        </ScrollView>
    </View>

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