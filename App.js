import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning"
};

export default function App() {
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [district, setDistrict] = useState();
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState();
  const [isPermission, setIsPermission] = useState(true);
  
  const getWeather = async() => {
    const { permission } = await Location.requestForegroundPermissionsAsync();
    if(!permission) {
      setIsPermission(false);
    }
    const {coords: { latitude, longitude }} = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const currentLocation = await Location.reverseGeocodeAsync(
      { latitude, longitude }, 
      { useGoogleMaps: false }
     );
      // console.log(currentLocation)
      setCountry(currentLocation[0].country);
      setCity(currentLocation[0].region);
      setDistrict(currentLocation[0].district);

      // fetch API
      const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
      const json = await response.json();
      setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city_container}>
        <Text style={styles.city_name}>{country} </Text>
        <Text style={styles.city_name}>{city}</Text>
      </View>
      <ScrollView 
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.weather_container}>
          {days.length === 0
            ? (
              <View style={styles.day_container}>
                <ActivityIndicator 
                  color="white"
                  size="large" 
                  style={{
                    marginTop: 50
                  }} />
              </View>
            )
            : (
              days.map((day, index) => {
                return (
                  <View key={index} style={styles.day_container}>
                    <View style={styles.date_container}>
                      <Text style={styles.date}>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
                    </View>
                    <View style={styles.weather_container}>
                      <View style={styles.temp_container}>
                          <Text style={styles.temperature}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                          <Text style={styles.description}>{day.weather[0].main}</Text>
                          <Text style={styles.text}>{day.weather[0].description}</Text>
                      </View>
                      <View style={styles.icon_container}>
                        <Fontisto
                          name={icons[day.weather[0].main]}
                          size={70}
                          color="black"
                        />
                      </View>
                    </View>
                  </View>
                )
              })
            )
          }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  // containers
  container: {
    flex: 1, 
    backgroundColor: "yellow"
  },
  city_container: {
    flex: .3,
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  date_container: {
    alignItems: "center",
    marginTop: 40
  },
  day_container: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 40,
  },
  weather_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  temp_container: {
    alignItems: "center",
  },  
  icon_container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 25,
    marginTop: 20
  },
  // contents
  city_name: {
    color: "yellow",
    fontSize: 24,
  },
  date: {
    fontSize: 18
  },
  temperature: {
    marginTop: 40,
    fontSize: 88,
  },
  description: {
    marginTop: -20,
    fontSize: 24
  },
  text: {
    fontSize: 14
  }
})