import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();
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
                secureTextEntry={true}
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
              <Entypo
                style={{ marginLeft: 8 }}
                name="image"
                size={24}
                color="gray"
              />
              <TextInput
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: avatar ? 18 : 18
                }}
                placeholder="Enter your image url"
                value={avatar}
                onChangeText={(text) => setAvatar(text)}
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
                Register
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

const styles = StyleSheet.create({});
