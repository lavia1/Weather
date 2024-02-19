import * as Location from 'expo-location';
import Weather from './Weather';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Position() {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [message, setMessage] = useState('Retrieving location...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log(status);

            try {
                if (status !== 'granted') {
                    setMessage('Location not permitted.');
                } else {
                    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                    console.log('Current position:', position);

                    if (position && position.coords) {
                        setLatitude(position.coords.latitude);
                        setLongitude(position.coords.longitude);
                        setMessage('Location retrieved');
                    } else {
                        setMessage('Error retrieving location. Coordinates not available.');
                    }
                }
            } catch (error) {
                setMessage('Error retrieving location.');
                console.log(error);
            }

            setIsLoading(false);
        })();
    }, []);

    if (isLoading) {
        // You can show a loading indicator here if needed
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View>
            <Text style={styles.coords}>{latitude.toFixed(3)}, {longitude.toFixed(3)}</Text>
            <Text style={styles.message}>{message}</Text>
            <Weather latitude={latitude} longitude={longitude} />
        </View>
    );
}

const styles = StyleSheet.create({
    coords: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        marginTop: 10,
    },
});
