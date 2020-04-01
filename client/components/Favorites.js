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
            const value = await AsyncStorage.getItem('@Favorites');
            if (value !== null) {
                return JSON.parse(value);
            } else {
                return ['No Favorites set'];
            }
        } catch (e) {
            return [];
        }
    };

    useEffect(() => {
        async function fetchData() {
            setFavorites(await getFavorites());
            // setFavorites([{
            //     stopName: '71 St',
            //     dayTimeRoutes: 'D'
            // }])
        }
        fetchData();
    }, [])

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
                        let allTrainImages = [];
                        for (let train of station["dayTimeRoutes"].split(' ')) {
                            allTrainImages.push(
                                <Image key={train} source={Images[train]} style={styles.Avatar} />
                            )
                        }
                        return (
                            <ListItem
                                onPress={() =>
                                    navigation('Train', { screen: 'SingleStation', params: { station: station['stopName'] } })
                                }
                                key={i}
                                leftAvatar={
                                    <View style={styles.ListItem}>
                                        {allTrainImages}
                                    </View>
                                }
                                title={station['stopName']}
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