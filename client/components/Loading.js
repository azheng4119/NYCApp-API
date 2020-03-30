import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from "lottie-react-native";

export default function lottie() {
	const reference = useRef(null)

	useEffect(() => {
		reference.current.play();
	});

	return (
		<View style={styles.container}>
				<LottieView
					ref={reference}
					style={{
						width: 80,
						height: 80
					}}
					loop={true}
					source={require('../assets/loading.json')}
				/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});