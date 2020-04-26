import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import axios from 'axios';
import Images from '../assets/images';
import { AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements'

export default function SingleStation({
	navigation,
	route,
}) {
	const [favorite, setFavorite] = useState(false);
	const [data, setData] = useState([]);


	const getFavorites = async () => {
		try {
			const value = await AsyncStorage.getItem(`&${route.params?.station}`)
			if (value !== null) {
				setFavorite(true);
			} else {
				setFavorite(false);
			}
		} catch (e) {
			// error reading value
		}
	}

	const saveFavorite = async () => {
		try {
			await AsyncStorage.setItem(`&${route.params?.station}`, `${route.params?.station}`)
			setFavorite(true);
		} catch (e) {
			// saving error
		}
	}

	const deleteFavorite = async () => {
		try {
			await AsyncStorage.removeItem(`&${route.params?.station}`);
			setFavorite(false);
		} catch (e) {
			// saving error
		}
	}

	const handleClick = () => {
		if (favorite) {
			deleteFavorite();
		} else {
			saveFavorite();

		}
	}
	useEffect(() => {
		console.log("Console: testing")
		navigation.setOptions({ title: route.params?.station });
		getTrainTimes();
		getFavorites();
	}, [route.params?.station]);

	const getTrainTimes = async () => {
		let { data } = await axios.get(`http://node-express-env.hfrpwhjwwy.us-east-2.elasticbeanstalk.com/trains/${route.params?.station}`);
		setData(data);
	}

	return (
		<ScrollView>
			<TouchableOpacity style={{ margin: 15 }}
				onPress={() => handleClick()}>
				<Icon name={favorite ? "favorite" : "favorite-border"} />
			</TouchableOpacity>
			{['Uptown', 'Downtown'].map(side => {
				const bound = side === 'Uptown' ? 'North' : 'South';
				return <ScrollView
					style={styles.Container}
					key={side}
				>
					<ListItem
						title={side}
						titleStyle={styles.Direction}
						bottomDivider
					/>
					{data.map((train, i) => {
						if (train[bound][0] !== undefined) {
							let nextTrain = train[bound][0] < 1 ? "Now" : train[bound][0] == 1 ? `Arriving in ${train[bound][0]} minute` : `Arriving in ${train[bound][0]} minutes`;
							let futureTrain;
							if (train[bound][1]) futureTrain = train[bound][1] + ' Mins';
							if (train[bound][2]) futureTrain += `, ${train[bound][2]} Mins`
							return (
								<ListItem
									key={i}
									leftAvatar={<Image source={Images[train["TrainNumber"]]} style={styles.Avatar} />}
									rightElement={<Text style={styles.RightSub}>{`${nextTrain} \n ${futureTrain}`}</Text>}
									bottomDivider
								/>
							)
						}
					})}
				</ScrollView>
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	Container: {
		marginTop: 10,
		marginLeft: 5,
		marginRight: 5,
	},
	Direction: {
		textAlign: "center",
		fontSize: 18,
	},
	Avatar: {
		height: 45,
		width: 45,
	},
	RightSub: {
		textAlign: 'right'
	}
});

