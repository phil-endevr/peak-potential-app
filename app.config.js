// app.config.js
import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "",
    revenueCatIosKeyTest: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY_TEST ?? "",
  },
});
