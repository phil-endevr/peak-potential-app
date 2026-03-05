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
    if (Platform.OS !== "ios") {
      return;
    }

    let purchaseUpdateSub: any;
    let purchaseErrorSub: any;

    const initIAP = async () => {
      await RNIap.initConnection();

      // Fetch products but don't block listener setup if it fails
      if (Platform.OS === "ios") {
        try {
          await RNIap.fetchProducts({ skus: iosPlanIds });
          console.log("✓ Products fetched successfully");
        } catch (err) {
          console.warn(
            "⚠️ Failed to fetch products (purchases may still work):",
            err,
          );
        }
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

          console.log(
            "Received purchase verification result from backend:",
            result,
          );

          if (result.success) {
            await RNIap.finishTransaction({ purchase });
            console.log(
              "Successfully verified purchase with backend and finished transaction",
            );
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: "IAP_RESULT",
                success: true,
              }),
            );
          } else {
            console.log(
              "Purchase verification failed on backend",
              result.error || "Unknown error",
            );
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

      purchaseErrorSub = RNIap.purchaseErrorListener((error) => {
        console.error("❌ Purchase error:", error);
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: "IAP_RESULT",
            success: false,
          }),
        );
      });
    };

    initIAP().catch((err) => {
      console.error("❌ Failed to initialize IAP connection:", err);
      webViewRef.current?.postMessage(
        JSON.stringify({
          type: "IAP_INIT_ERROR",
          success: false,
        }),
      );
    });

    return () => {
      purchaseUpdateSub?.remove();
      purchaseErrorSub?.remove();
      RNIap.endConnection();
    };
  }, []);

  const handleMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === "START_IAP" && Platform.OS === "ios") {
      console.log("🛒 Starting IAP purchase for:", data.productId);
      try {
        await RNIap.requestPurchase({
          type: "subs",
          request: {
            apple: {
              sku: data.productId,
            },
          },
        });
      } catch (err) {
        console.error("❌ Purchase request failed:", err);
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
