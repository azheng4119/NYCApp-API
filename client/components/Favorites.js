import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AsyncStorage } from 'react-native';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import Loading from '../components/Loading';
import Images from '../assets/images';

export const Favorites = ({ navigation }) => {

    const [favorites, setFavorites] = useState([]);

    const getFavorites = async () => {
        try {
            const value = await AsyncStorage.getAllKeys();
            console.log(value)
            if (value !== null) {
                return setFavorites(value.map(station => station.includes('&') ? station.split('&')[1] : ''));
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
                            key={i}
                            title={station}
                        />
                    }
                    else {
                        // let allTrainImages = [];
                        // for (let train of station["dayTimeRoutes"].split(' ')) {
                        //     allTrainImages.push(
                        //         <Image key={train} source={Images[train]} style={styles.Avatar} />
                        //     )
                        // }
                        return (
                            <ListItem
                                onPress={() => {
                                    navigation.navigate('Single', { station: station })
                                }
                                }
                                key={i}
                                leftAvatar={
                                    <View style={styles.ListItem}>
                                        {/* {allTrainImages} */}
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