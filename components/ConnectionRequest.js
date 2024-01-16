import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConnectionRequest = ({
  requests,
  connectionRequests,
  setConnectionRequests,
  userId
}) => {
  const acceptConnection = async (requestId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("Authentication token is missing.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(
        "http://192.168.0.10:8000/api/v1/users/connection-requests/accept",
        { senderId: requestId },
        config
      );

      if (response.ok) {
        setConnectionRequests(
          connectionRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={{ uri: requests?.avatar }}
        />

        <Text style={{ width: 200 }}>
          {requests?.name} is Inviting you to Connect
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Feather name="x" size={22} color="black" />
          </View>

          <Pressable
            onPress={() => acceptConnection(requests._id)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Ionicons name="ios-checkmark-outline" size={22} color="#0072b1" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ConnectionRequest;

const styles = StyleSheet.create({});
