import React, { useState, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import TrainStops from '../assets/data/trainStops';
import Images from '../assets/images';

export default function SingleTrain({
	navigation,
	route,
}) {

	useEffect(() => {
		navigation.setOptions({ title: route.params?.train + " Train" });
	}, []);

	const currentTrain = route.params?.train;
	return (
		<ScrollView>
			{Object.entries(TrainStops[currentTrain]).map(([key, value]) => (
				<ListItem
					onPress={() => navigation.navigate('SingleStation', { station: value })}
					key={key}
					// leftAvatar={{ source: Images[currentTrain] }}
					title={value}
					bottomDivider
					chevron
				/>
			))}
		</ScrollView>
	);
}


