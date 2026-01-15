import brandColors from "@/constants/colors";
import React from "react";
import { Button, FlatList, Image, Text, View } from "react-native";

const PlanCards = ({
  offerings,
  onSelect,
}: {
  offerings: any;
  onSelect: (pkgId: any) => void;
}) => {
  //   if (!offerings?.current) return null;

  return (
    <FlatList
      data={offerings}
      keyExtractor={(pkg) => pkg.id}
      renderItem={({ item: pkg }) => (
        <View
          style={{
            padding: 16,
            marginBottom: 16,
            borderRadius: 8,
            backgroundColor: "#252422",
            width: 360,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: brandColors.primary,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            {pkg.title}
          </Text>
          {pkg.recommended && (
            <Text style={{ color: "white" }}>(Recommended)</Text>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "white", marginRight: 20, fontSize: 18 }}>
              £{pkg.price} GBP/monthly
            </Text>
            <Text
              style={{
                color: "white",
                textDecorationLine: "line-through",
                marginVertical: 8,
              }}
            >
              {pkg.originalPrice} GBP/monthly
            </Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            {pkg.features.map((feature: string, i: number) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 28,
                }}
              >
                <Image
                  source={require("@/assets/icons/tick.png")}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text style={{ color: "white", flexShrink: 1 }}>{feature}</Text>
              </View>
            ))}
          </View>
          <View
            style={{ backgroundColor: brandColors.primary, borderRadius: 20 }}
          >
            <Button
              title="Get Started"
              color="black"
              onPress={() => onSelect(pkg?.id)}
            />
          </View>
        </View>
      )}
    />
  );
};

export default PlanCards;
