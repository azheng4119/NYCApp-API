import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { Icon } from 'react-native-elements';

import axios from 'axios';

export default function NearByMap({
	navigation,
}) {
	const [nearBy, setNearBy] = useState([]);
	const [count, setCount] = useState(0);

	const mapView = useRef(null)

	useEffect(() => {
		getNearByStations();
	}, [count]);

	const getNearByStations = async () => {
		try {
			await navigator.geolocation.getCurrentPosition(
				position => {
					const obj = JSON.stringify(position);
					const location = JSON.parse(obj);
					const currLoc = { latitude: location[`coords`][`latitude`], longitude: location[`coords`][`longitude`] };
					let region = {
						latitude: location[`coords`][`latitude`],
						longitude: location[`coords`][`longitude`],
						latitudeDelta: 0.01,
						longitudeDelta: 0.01
					}
					console.log(currLoc)
					mapView.current.animateToRegion(region, 1000);
					searchOnCoords(currLoc);
				},
				error => console.log(error.message),
				{ timeout: 20000, maximumAge: 1000 }
			)
		} catch (err) {
			console.log(err)
		}
	};

	const searchOnCoords = async (currLoc) => {
		try {
			let { data } = await axios.get(`http://node-express-env.hfrpwhjwwy.us-east-2.elasticbeanstalk.com/trains/${currLoc.latitude}/${currLoc.longitude}`);
			setNearBy(data);
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.button}
				onPress={() => setCount(count + 1)}
			>
				<Icon
					name='ios-refresh'
					type='ionicon'
				/>
			</TouchableOpacity>
			<MapView
				style={[styles.map, { flex: 1, marginBottom: 0 }]}
				initialRegion={{
					latitude: 40.7549,
					longitude: -73.9840,
					latitudeDelta: .08,
					longitudeDelta: .08,
				}}
				showsUserLocation={true}
				showsMyLocationButton={true}
				showsCompass={false}
				loadingEnabled={true}
				ref={mapView}>
				{nearBy.map((station, i) => {
					return (
						<MapView.Marker
							key={i}
							coordinate={{
								"latitude": station.latitude,
								"longitude": station.longitude,
							}}
							title={station.stopName}
							description={station.dayTimeRoutes}>
							<MapView.Callout
								onPress={() =>
									navigation.navigate('Train', { screen: 'SingleStation', params: { station: station.stopName } })}
							/>
						</MapView.Marker>
					)
				})}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		zIndex: 0,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		alignItems: 'flex-end',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	button: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: "center",
		margin: 20,
		zIndex: 1,
		width: 40,
		height: 40,
		backgroundColor: 'white',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#fff'
	}
});
