import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const UserProfile = ({ item, userId }) => {
  const [connectionSent, setConnectionSent] = useState(false);

  const sendConnectionRequest = async (selectedUserId) => {
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
        "http://192.168.0.10:8000/api/v1/users/sendConnection",
        { selectedUserId },
        config
      );

      if (response.data.success) {
        setConnectionSent(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 9,
        marginHorizontal: 16,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        marginVertical: 10,
        justifyContent: "center",
        height: Dimensions.get("window").height / 4,
        width: (Dimensions.get("window").width - 80) / 2
      }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            resizeMode: "cover"
          }}
          source={{ uri: item.item?.avatar }}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          {item.item?.name}
        </Text>
        <Text style={{ textAlign: "center", marginLeft: 1, marginTop: 2 }}>
          Engineer Graduate | Linkedin member
        </Text>
      </View>

      <Pressable
        onPress={() => sendConnectionRequest(item.item?._id)}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          borderColor:
            connectionSent || item?.connectionRequests?.includes(userId)
              ? "gray"
              : "#0072b1",
          borderWidth: 1,
          borderRadius: 25,
          marginTop: 7,
          paddingHorizontal: 15,
          paddingVertical: 4
        }}
        disabled={connectionSent || item?.connectionRequests?.includes(userId)}>
        <Text
          style={{
            fontWeight: "600",
            color:
              connectionSent || item?.connectionRequests?.includes(userId)
                ? "gray"
                : "#0072b1"
          }}>
          {connectionSent || item?.connectionRequests?.includes(userId)
            ? "Pending"
            : "Connect"}
        </Text>
      </Pressable>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
