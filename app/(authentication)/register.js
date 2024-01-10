import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import linkedin from "../../assets/linkedin.png";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      if (!result.cancelled) {
        setAvatar(result.assets[0].uri);
        console.log(result.assets[0].uri); // Log the URI here
      } else {
        console.log("Image selection canceled");
      }
    } catch (error) {
      console.log("ImagePicker Error: ", error);
    }
  };

  const handleRegister = async () =>
  {
      setLoading(true);
    try {
      const userDetails = new FormData();

      userDetails.append("name", name);
      userDetails.append("email", email);
      userDetails.append("password", password);

      if (avatar) {
        const uriParts = avatar.split(".");
        const fileType = uriParts[uriParts.length - 1];
        userDetails.append("avatar", {
          uri: avatar,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`
        });
      }

      const response = await axios.post(
        "http://192.168.0.10:8000/api/v1/users/register",
        userDetails,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(response?.data);
      Alert.alert(
        "Registration Successful",
        "You have been registered successfully"
      );

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setAvatar("");
    } catch (error) {
      console.log("Error while registering the user: ", error);
      Alert.alert(
        "Registration Unsuccessful",
        "An error occurred while registering"
      );
    } finally
    {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View>
        <Image
          style={{ width: 150, height: 150, resizeMode: "contain" }}
          source={linkedin}
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
            Create your account
          </Text>
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
            <Ionicons
              style={{ marginLeft: 8 }}
              name="person"
              size={24}
              color="gray"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: name ? 18 : 18
              }}
              placeholder="Enter your name"
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
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={24}
                color="gray"
              />
              <TextInput
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: email ? 18 : 18
                }}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
          </View>
          <View style={{ marginTop: 0, marginBottom: 20 }}>
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
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {avatar ? (
              <Text style={styles.buttonText}>
                Successfully uploaded the image
              </Text>
            ) : (
              <Text style={styles.buttonText}>Pick an Image</Text>
            )}
            {/* {avatar && <Image source={avatar} style={styles.image} />} */}
          </TouchableOpacity>
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
              onPress={handleRegister}
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
                {loading ? "Registering..." : "Register"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/login")}
              style={{ marginTop: 15 }}>
              <Text
                style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
                Already have an account? Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  imageContainer: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    color: "blue"
    // marginBottom: 10
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10
  }
});
