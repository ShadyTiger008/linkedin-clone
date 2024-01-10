import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userDetails = {
        email: email,
        password: password
      };

      const response = await axios.post(
        "http://192.168.0.10:8000/api/v1/users/login",
        userDetails
      );

      console.log(response?.data);
      const token = response?.data?.data?.accessToken;
      console.log("Token", token);
      AsyncStorage.setItem("authToken", token);
      Alert.alert("Login Successful", "You have been logged in successfully");

      setEmail("");
      setPassword("");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Error while registering the user: ", error);
      Alert.alert(
        "Registration Unsuccessful",
        "An error occurred while registering"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View>
        <Image
          style={{ width: 150, height: 150, resizeMode: "contain" }}
          source={{
            url: "https://www.freepnglogos.com/uploads/linkedin-logo-transparent-png-25.png"
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42"
            }}>
            Login to your account
          </Text>
        </View>
        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30
            }}>
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 18 : 18
              }}
              placeholder="Enter your Email"
            />
          </View>
          <View style={{ marginTop: 0 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30
              }}>
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="gray"
              />
              <TextInput
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 18 : 18
                }}
                placeholder="Enter your Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 12,
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <Text>Keep me logged in</Text>
            <Text style={{ color: "#007FFF", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>
          <View style={{ marginTop: 80 }}>
            <Pressable
              onPress={handleLogin}
              style={{
                width: 200,
                backgroundColor: "#0072b1",
                borderRadius: 6,
                marginLeft: "auto",
                marginRight: "auto",
                padding: 15
              }}>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold"
                }}>
                {loading ? "Login in" : "Login"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/register")}
              style={{ marginTop: 15 }}>
              <Text
                style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
