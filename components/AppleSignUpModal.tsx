import brandColors from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import PlanCards from "./PlanCards";

const AppleSignUpModal = ({ onClose }: { onClose: () => void }) => {
  const [offerings, setOfferings] = useState<any>(null);

  useEffect(() => {
    // const fetchOfferings = async () => {
    //   try {
    //     const offerings = await Purchases.getOfferings();
    //     setOfferings(offerings);
    //   } catch (e) {
    //     console.log("Error fetching offerings", e);
    //   }
    // };
    // fetchOfferings();
  }, []);

  const purchasePackage = async (pkg: any) => {
    try {
      const purchase = await Purchases.purchasePackage(pkg);
      console.log("Purchase successful:", purchase);
      // unlock features or update app state based on entitlements
    } catch (error: any) {
      if (!error.userCancelled) {
        console.log("Purchase error:", error);
      }
    }
  };

  return (
    <View style={{ marginTop: 100 }}>
      <View style={{ position: "absolute", top: 0, right: 20, zIndex: 10 }}>
        <Button title="Close" onPress={() => onClose()} />
      </View>
      <Text
        style={{
          color: brandColors.primary,
          fontSize: 20,
          marginBottom: 16,
          marginTop: 50,
        }}
      >
        OUR MEMBERSHIP PLANS
      </Text>
      <PlanCards offerings={offerings} onPurchase={purchasePackage} />
    </View>
  );
};

export default AppleSignUpModal;
