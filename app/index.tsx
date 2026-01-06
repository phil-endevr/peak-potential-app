import AppleSignUpModal from "@/components/AppleSignUpModal";
import WebviewApp from "@/components/WebviewApp";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSettingsPage, setIsSettingsPage] = useState<boolean>(false);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === "ios") {
      Purchases.configure({
        apiKey: Constants.expoConfig?.extra?.revenueCatIosKey,
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        <WebviewApp
          setIsLoggedIn={setIsLoggedIn}
          setIsSettingsPage={setIsSettingsPage}
        />
        {Platform.OS === "ios" && !isLoggedIn && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Text
                style={{
                  color: "#d3d3d3",
                  textDecorationLine: "underline",
                  marginTop: 5,
                }}
              >
                Register here
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          animationType="slide"
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000000",
            }}
          >
            <AppleSignUpModal onClose={() => setShowModal(false)} />
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
