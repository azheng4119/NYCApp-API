import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';
import Images from '../assets/images';
import { AsyncStorage } from 'react-native';

export default function SingleStation({
	navigation,
	route,
}) {
	const [favorite, setFavorite] = useState(false);
	const [data, setData] = useState([]);


	const getFavorites = async () => {
		console.log(favorite)
		try {
			const value = await AsyncStorage.getItem(`&${route.params?.station}`)
			console.log(value);
			if (value !== null) {
				setFavorite(true);
			}else{
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

	const deleteFavorite = async () =>{
		try {
			await AsyncStorage.removeItem(`@${route.params?.station}`);
			setFavorite(false);
		} catch (e) {
			// saving error
		}
	}

	const handleClick = () => {
		if (favorite){
			deleteFavorite();
		}else{
			saveFavorite();
			
		}
	}
	useEffect(() => {
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
			<TouchableOpacity
				onPress={()=>handleClick()}
			>
				<Text>
					{favorite ? "Favorite" : "Not Favorite"}
				</Text>
			</TouchableOpacity>
			<ScrollView style={styles.Container}>
				<ListItem
					title={'Uptown'}
					titleStyle={styles.Direction}
					bottomDivider
				/>
				{data.map((train, i) => {
					if (train["North"][0] !== undefined) {
						let nextTrain = train["North"][0] < 1 ? "Now" : train["North"][0] == 1 ? `in ${train["North"][0]} minute` : `in ${train["North"][0]} minutes`;
						let futureTrain;
						if (train["North"][1]) futureTrain = train["North"][1]
						if (train["North"][2]) futureTrain += `, ${train["North"][2]}`
						return (
							<ListItem
								key={i}
								leftAvatar={<Image source={Images[train["TrainNumber"]]} style={styles.Avatar} />}
								rightSubtitle={`Arriving ${nextTrain} \n${futureTrain}`}
								bottomDivider
							/>
						)
					}
				})}
			</ScrollView>
			<ScrollView style={styles.Container}>
				<ListItem
					title={'Downtown'}
					titleStyle={styles.Direction}
					bottomDivider
				/>
				{data.map((train, i) => {
					if (train["South"][0] !== undefined) {
						let nextTrain = train["South"][0] < 1 ? "Now" : train["South"][0] == 1 ? `in ${train["South"][0]} minute` : `in ${train["South"][0]} minutes`;
						let futureTrain;
						if (train["South"][1]) futureTrain = train["South"][1]
						if (train["South"][2]) futureTrain += `, ${train["South"][2]}`
						return (
							<ListItem
								key={i}
								leftAvatar={<Image source={Images[train["TrainNumber"]]} style={styles.Avatar} />}
								rightSubtitle={`Arriving ${nextTrain} \n${futureTrain}`}
								bottomDivider
							/>
						)
					}
				})}
			</ScrollView>
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
});

