// app.config.js
import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? "",
  },
});
