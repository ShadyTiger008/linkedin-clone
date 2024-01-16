import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64"; // Import for base-64 polyfill
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import UserProfile from "../../../components/UserProfile";
import ConnectionRequest from "../../../components/ConnectionRequest";
import { useRouter } from "expo-router";

global.atob = decode; // Polyfill atob

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log("In network index tab token is: ", token);

      try {
        const decodedAccessToken = jwtDecode(
          token,
          process.env.REFRESH_TOKEN_SECRET
        );
        // console.log(decodedAccessToken);
        setUserId(decodedAccessToken._id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          // Check if userId is not an empty string
          const response = await axios.get(
            `http://192.168.0.10:8000/api/v1/users/getUser/${userId}`
          );
          const loggedUser = await response.data.data.user;
          setUser(loggedUser);
        }
      } catch (error) {
        console.log("Error getting the user: ", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // console.log("Now the user is: ", user);

  useEffect(() => {
    try {
      const getOtherUsers = async () => {
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

        const response = await axios.get(
          "http://192.168.0.10:8000/api/v1/users/otherUsers",
          config
        );

        const userProfiles = await response.data;
        setOtherUsers(userProfiles);

        // console.log("Other Users", userProfiles);
      };

      getOtherUsers();
    } catch (error) {
      console.log("Error fetching other user profiles: ", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserRequests();
    }
  }, [userId]);

  const fetchUserRequests = async () => {
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
      const response = await axios.get(
        "http://192.168.0.10:8000/api/v1/users/connection-requests",
        config
      );

      console.log(
        "Fetch user requests function console: ",
        response.data.data.Requests
      );

      if (response.status === 200) {
        const connectionRequestsData = response.data.data.Requests?.map(
          (friendRequest) => ({
            _id: friendRequest?._id,
            name: friendRequest?.name,
            email: friendRequest?.email,
            avatar: friendRequest?.avatar
          })
        );

        setConnectionRequests(connectionRequestsData);
      }
      console.log("COnnectionRequests: ", connectionRequests);
    } catch (error) {
      console.error("Error fetching connection requests: ", error);
    }
  };

  console.log("COnnectionRequests: ", connectionRequests);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Pressable
        onPress={() => router.push("/networks/connections")}
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
        <Text>Manage My Network</Text>
        <AntDesign name="arrowright" size={24} color="black" />
      </Pressable>

      <View
        style={{
          borderColor: "#E0E0E0",
          borderWidth: 2,
          marginVertical: 10
        }}
      />

      <View
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Invitations {0}</Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </View>

      <View
        style={{
          borderColor: "#E0E0E0",
          borderWidth: 2,
          marginVertical: 10
        }}
      />

      <View>
        {connectionRequests?.map((requests, index) => (
          <ConnectionRequest
            requests={requests}
            key={index}
            connectionRequests={connectionRequests}
            setConnectionRequests={setConnectionRequests}
            userId={userId}
          />
        ))}
      </View>

      <View style={{ marginHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
          <Text>Grow your network faster</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>

        <Text>
          Find and contact the right people. Plus see who's viewed your profile
        </Text>

        <View
          style={{
            backgroundColor: "#FFC72C",
            width: 140,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 25,
            marginTop: 8
          }}>
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: 600 }}>
            Try Premium
          </Text>
        </View>
      </View>

      <FlatList
        data={otherUsers}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={(item, index) => <UserProfile item={item} key={index} />}
      />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
