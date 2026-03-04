import React from "react";

import { WebView } from "react-native-webview";

const WebviewApp = () => {
  return (
    <WebView
      source={{ uri: `https://peakpotential.world/app/sign-in` }}
      allowsFullscreenVideo={true}
    />
  );
};

export default WebviewApp;
