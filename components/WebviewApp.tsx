import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useRef } from "react";
import { Alert, Linking, Platform } from "react-native";
import { WebView } from "react-native-webview";

const WebviewApp = ({
  setIsLoggedIn,
  setIsSettingsPage,
}: {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsPage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const webviewRef = useRef<WebView>(null);
  const handleDownload = async (url: string) => {
    try {
      const fileName = url.split("/").pop() ?? "downloaded-file";

      const downloadDir = new Directory(Paths.cache, "downloads");
      downloadDir.create({ intermediates: true });

      const destinationFile = new File(downloadDir, fileName);

      const { uri } = await File.downloadFileAsync(url, destinationFile);
      Alert.alert("Download Complete", `File saved to: ${uri}`);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert("Download Failed", err.message);
      } else {
        Alert.alert("Download Failed", "An unknown error occurred");
      }
    }
  };

  const hideDiv = () => {
    const jsCode = `
      var el1 = document.getElementById('register-prompt');
      if (el1) { el1.style.display = 'none'; }
      var el2 = document.getElementById('manage-plan');
      if (el2) { el2.style.display = 'none'; }
      true; 
    `;
    webviewRef.current?.injectJavaScript(jsCode);
    return;
  };

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === "LOGIN_SUCCESS") {
      setIsLoggedIn(true);
      console.log("Login confirmed by WebView!");
    }

    if (data.type === "LOGOUT") {
      setIsLoggedIn(false);
      console.log("Logout confirmed by WebView!");
    }

    if (data.type === "SETTINGS_OPEN") {
      setIsSettingsPage(true);
    }

    if (Platform.OS === "ios" && data.type === "OPEN_APPLE_SUBSCRIPTIONS") {
      Linking.openURL("https://apps.apple.com/account/subscriptions");
    }
  };

  return (
    <WebView
      ref={webviewRef}
      onLoadEnd={() => {
        if (Platform.OS === "ios") {
          hideDiv();
        }
      }}
      onMessage={handleMessage}
      onNavigationStateChange={() => setIsSettingsPage(false)}
      source={{ uri: `https://peakpotential.world/app/sign-in` }}
      allowsFullscreenVideo={true}
      onShouldStartLoadWithRequest={(event) => {
        const { url } = event;
        // Detect common downloadable file types
        if (url.match(/\.(pdf|docx|xlsx|png|jpg|zip)$/i)) {
          handleDownload(url);
          return false; // Prevent WebView from navigating to the file
        }
        return true;
      }}
      injectedJavaScript={
        Platform.OS === "ios"
          ? `
        window.__APP_PLATFORM__ = 'ios';
        true;
      `
          : undefined
      }
    />
  );
};

export default WebviewApp;
