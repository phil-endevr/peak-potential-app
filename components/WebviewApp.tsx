import React, { useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const WebviewApp = () => {
  const webViewRef = useRef<WebView>(null);

  const injectedJS = `
    window.isNativeApp = true;
    true;
  `;

  const handleMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("Message received from WebView:", data);
  };

  return (
    <WebView
      source={{ uri: `https://peakpotential.world/app/sign-in` }}
      allowsFullscreenVideo
      injectedJavaScriptBeforeContentLoaded={injectedJS}
      onMessage={handleMessage}
      ref={webViewRef}
    />
  );
};

export default WebviewApp;
