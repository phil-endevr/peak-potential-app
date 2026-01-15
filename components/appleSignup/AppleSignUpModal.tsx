import brandColors from "@/constants/colors";
import { mockOfferings } from "@/data/mockOfferings";
import plans from "@/data/plans";
import mapPackagesToPlans from "@/functions/mapPackagesToPlans";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import Purchases, { PurchasesOfferings } from "react-native-purchases";
import PlanCards from "./PlanCards";
import SignUpForm from "./SignUpForm";

const AppleSignUpModal = ({ onClose }: { onClose: () => void }) => {
  const [offerings, setOfferings] = useState<any>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [rcOfferings, setRcOfferings] = useState<PurchasesOfferings | null>(
    null
  );
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);

  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        const fetchedOfferings = await Purchases.getOfferings();
        setRcOfferings(fetchedOfferings);
        const mappedOfferings = mapPackagesToPlans(fetchedOfferings, plans);
        setOfferings(mappedOfferings);
        setIsUsingMockData(false);
      } catch (e) {
        console.log("Error fetching offerings, falling back to mock data:", e);
        // Fallback to mock data in development
        const mappedOfferings = mapPackagesToPlans(mockOfferings, plans);
        setOfferings(mappedOfferings);
        setIsUsingMockData(true);
      }
    };
    fetchOfferings();
  }, []);

  return (
    <View style={{ marginTop: 100, minHeight: 700, alignItems: "center" }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 20,
          zIndex: 10,
          marginTop: selectedPackageId ? 40 : 0,
        }}
      >
        <Button title="Close" color="white" onPress={() => onClose()} />
      </View>

      <View>
        <>
          {selectedPackageId ? (
            <SignUpForm
              packageId={selectedPackageId}
              offerings={rcOfferings}
              isUsingMockData={isUsingMockData}
              onClose={onClose}
            />
          ) : (
            <View>
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
              <PlanCards
                offerings={offerings}
                onSelect={setSelectedPackageId}
              />
            </View>
          )}
        </>
      </View>
    </View>
  );
};

export default AppleSignUpModal;
