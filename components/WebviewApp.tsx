import ApiClient from "@/clients/httpClient";
import iosPlanIds from "@/constants/iosPlanIds";
import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as RNIap from "react-native-iap";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const WebviewApp = () => {
  const webViewRef = useRef<WebView>(null);
  const apiClientRef = useRef(new ApiClient());

  const injectedJS = `
    window.isNativeApp = true;
    window.nativePlatform = "${Platform.OS}";
    true;
  `;

  useEffect(() => {
    let purchaseUpdateSub: any;
    let purchaseErrorSub: any;

    const initIAP = async () => {
      await RNIap.initConnection();

      if (Platform.OS === "ios") {
        await RNIap.fetchProducts({ skus: iosPlanIds });
      }

      purchaseUpdateSub = RNIap.purchaseUpdatedListener(async (purchase) => {
        try {
          if (!purchase.purchaseToken) {
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: "IAP_RESULT",
                success: false,
              }),
            );
            return;
          }

          const response = await apiClientRef.current.post(
            "apple/verify-purchase",
            {
              purchaseToken: purchase.purchaseToken,
            },
          );

          const result = await response.json();

          if (result.success) {
            await RNIap.finishTransaction({ purchase });

            webViewRef.current?.postMessage(
              JSON.stringify({
                type: "IAP_RESULT",
                success: true,
              }),
            );
          } else {
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: "IAP_RESULT",
                success: false,
              }),
            );
          }
        } catch {
          webViewRef.current?.postMessage(
            JSON.stringify({
              type: "IAP_RESULT",
              success: false,
            }),
          );
        }
      });

      purchaseErrorSub = RNIap.purchaseErrorListener(() => {
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: "IAP_RESULT",
            success: false,
          }),
        );
      });
    };

    initIAP();

    return () => {
      purchaseUpdateSub?.remove();
      purchaseErrorSub?.remove();
      RNIap.endConnection();
    };
  }, []);

  const handleMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === "START_IAP" && Platform.OS === "ios") {
      try {
        await RNIap.requestPurchase({
          type: "in-app",
          request: {
            apple: {
              sku: data.productId,
            },
          },
        });
      } catch {
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: "IAP_RESULT",
            success: false,
          }),
        );
      }
    }
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
