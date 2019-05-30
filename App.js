import React from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ImageBackground,
	TextInput
} from "react-native";

import MapView, { Marker } from "react-native-maps";

export default () => {
	[loggedIn, setLoggedIn] = React.useState(false);
	[userName, setUserName] = React.useState("daniel");
	[password, setPassword] = React.useState("123");
	[friends, setFriends] = React.useState([]);
	[coords, setCoords] = React.useState({ lon: 12.508234, lat: 55.770694 });

	React.useEffect(() => {
		navigator.geolocation.getCurrentPosition(e =>
			setCoords({
				lon: e.coords.longitude,
				lat: e.coords.latitude
			})
		);
	}, []);

	const remote = {
		uri: "https://media.giphy.com/media/fvA2yyDs41adW/giphy.gif"
	};

	const login = async () => {
		const uri = "https://hupra.dk/miniproject/api/login";
		const response = await fetch(uri, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userName,
				password,
				lon: coords.lon,
				lat: coords.lat,
				distance: 1000
			})
		});

		if (response.ok) {
			setLoggedIn(true);

			const data = await response.json();

			setFriends(data.friends.filter(f => f.userName != userName));
		}
	};

	return (
		<ImageBackground source={remote} style={{ width: "100%", height: "100%" }}>
			<View style={styles.container}>
				{!loggedIn && (
					<View style={styles.box}>
						<Text style={styles.label}>Username</Text>
						<TextInput
							value={userName}
							style={styles.input}
							onChangeText={text => setUserName(text)}
						/>
						<Text style={styles.label}>Password</Text>
						<TextInput
							value={password}
							style={styles.input}
							onChangeText={text => setPassword(text)}
							secureTextEntry={true}
						/>
						<TouchableOpacity style={styles.btn} onPress={login}>
							<Text style={styles.c}>Login</Text>
						</TouchableOpacity>
					</View>
				)}
				{loggedIn && (
					<>
						<TouchableOpacity
							style={styles.btn}
							onPress={() => setLoggedIn(false)}
						>
							<Text style={styles.c}>Logout</Text>
						</TouchableOpacity>
						<MapView
							initialRegion={{
								latitude: coords.lat,
								longitude: coords.lon,
								latitudeDelta: 0.003,
								longitudeDelta: 0.003
							}}
							style={styles.map}
						>
							<Marker
								coordinate={{
									latitude: coords.lat,
									longitude: coords.lon
								}}
								title={userName}
								pinColor={"#000000"}
							/>
							{friends.map(f => (
								<Marker
									coordinate={{
										latitude: f.lat,
										longitude: f.lon
									}}
									title={f.userName}
								/>
							))}
						</MapView>
					</>
				)}
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		align: "center",
		justifyContent: "center"
	},
	map: {
		width: "100%",
		height: "100%",
		flex: 1
	},
	box: {
		textAlign: "center",
		backgroundColor: "rgba(0,0,0, 0.3)",
		width: "90%",
		marginLeft: "5%",
		borderRadius: "4px",
		borderWidth: 1,
		borderColor: "tomato",
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.8,
		shadowRadius: 2
	},
	input: {
		padding: 15,
		paddingRight: 20,
		paddingLeft: 20,
		borderColor: "black",
		borderRadius: "4",
		borderStyle: "solid",
		borderWidth: 1,
		backgroundColor: "white"
	},
	btn: {
		marginTop: 30,
		marginBottom: 15,
		padding: 15,
		paddingRight: 20,
		paddingLeft: 20,
		borderColor: "black",
		borderRadius: "4",
		borderStyle: "solid",
		borderWidth: 1,
		backgroundColor: "white"
	},
	label: {
		paddingTop: 15,
		marginBottom: 2,
		marginLeft: 2,
		fontSize: 12,
		color: "white"
	},
	white: {
		color: "white"
	},
	c: {
		textAlign: "center"
	}
});
