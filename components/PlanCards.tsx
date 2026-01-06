import brandColors from "@/constants/colors";
import plans from "@/data/plans";
import React from "react";
import { Button, FlatList, Image, Text, View } from "react-native";

const PlanCards = ({
  offerings,
  onPurchase,
}: {
  offerings: any;
  onPurchase: (pkg: any) => void;
}) => {
  //   if (!offerings?.current) return null;

  return (
    // <FlatList
    //   data={offerings.current.availablePackages}
    //   keyExtractor={(pkg) => pkg.identifier}
    //   renderItem={({ item: pkg }) => (
    //     <View
    //       style={{
    //         padding: 16,
    //         marginBottom: 16,
    //         borderWidth: 1,
    //         borderRadius: 8,
    //       }}
    //     >
    //       <Text style={{ fontSize: 18, color: "white" }}>
    //         {pkg.product.title}
    //       </Text>
    //       <Text style={{ color: "white" }}>{pkg.product.description}</Text>
    //       <Text style={{ fontWeight: "bold", color: "white" }}>
    //         {pkg.product.price_string}
    //       </Text>
    //       <Button title="Select Plan" onPress={() => onPurchase(pkg)} />
    //     </View>
    //   )}
    // />
    <FlatList
      data={plans}
      keyExtractor={(pkg) => pkg.id}
      renderItem={({ item: pkg }) => (
        <View
          style={{
            padding: 16,
            marginBottom: 16,
            marginTop: 8,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: "#252422",
            width: 360,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: brandColors.primary,
              marginBottom: 16,
              fontWeight: "bold",
            }}
          >
            {pkg.title}
          </Text>
          {pkg.recommended && (
            <Text
              style={{
                color: "white",
                marginBottom: 16,
                fontWeight: "bold",
              }}
            >
              (Recommended)
            </Text>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "white", marginRight: 8, fontSize: 16 }}>
              {pkg.price} GBP/monthly
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: "gray",
                textDecorationLine: "line-through",
                fontSize: 16,
              }}
            >
              {pkg.originalPrice}
            </Text>
          </View>
          <View style={{ marginBottom: 16 }}>
            {pkg.features.map((feature: string, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/icons/tick.png")}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text style={{ color: "white", flexShrink: 1 }}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={{ backgroundColor: brandColors.primary, borderRadius: 20 }}
          >
            <Button
              title="Get Started"
              color="black"
              onPress={() => onPurchase(pkg)}
            />
          </View>
        </View>
      )}
    />
  );
};

export default PlanCards;
