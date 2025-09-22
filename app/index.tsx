import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        <WebView source={{ uri: "https://peakpotential.world/app/sign-in" }} />
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
